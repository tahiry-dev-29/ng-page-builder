import { Component, ChangeDetectionStrategy, input, computed, signal, inject } from '@angular/core';
import { DimensionControlComponent } from '../controls/dimension-control.component';
import { SelectControlComponent } from '../controls/select-control.component';
import { CollapsibleSectionComponent } from '../components/collapsible-section.component';
import { getAdvancedOptions } from '../advanced-options-registry';
import { BuilderStateService } from '@admin/services/builder-state-service';
import { BlockStyles } from 'page-builder';

@Component({
  selector: 'app-advanced-settings',
  standalone: true,
  imports: [SelectControlComponent, CollapsibleSectionComponent],
  template: `
    <div class="p-4 overflow-y-auto h-full">
      @for (option of advancedOptions(); track option.id) { @switch (option.id) { @case ('layout') {
      <app-collapsible-section [title]="option.label" [icon]="option.icon" [defaultOpen]="true">
        <!-- Marge -->
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">Marge</label>
          <div class="flex gap-2">
            <input 
              type="text" 
              class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
              placeholder="ex: 10px"
              [value]="currentStyles().margin || ''"
              (input)="updateStyle('margin', $any($event.target).value)"
            />
          </div>
        </div>

        <!-- Padding -->
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">Padding</label>
          <div class="flex gap-2">
            <input 
              type="text" 
              class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
              placeholder="ex: 10px"
              [value]="currentStyles().padding || ''"
              (input)="updateStyle('padding', $any($event.target).value)"
            />
          </div>
        </div>

        <!-- Largeur -->
        <app-select-control 
          label="Largeur" 
          [options]="['auto', '100%', '50%', '33%']" 
          [value]="currentStyles().width || 'auto'"
          (valueChange)="updateStyle('width', $event)"
        />

        <!-- Z-Index -->
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">Z-Index</label>
          <input
            type="number"
            class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
            [value]="parseNumber(currentStyles().zIndex)"
            (input)="updateStyle('zIndex', $any($event.target).value)"
          />
        </div>

        <!-- ID CSS -->
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">ID CSS</label>
          <input
            type="text"
            class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
            placeholder="element-id"
            [value]="currentData()['cssId'] || ''"
            (input)="updateData('cssId', $any($event.target).value)"
          />
        </div>
        
        <!-- Classes CSS -->
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">Classes CSS</label>
          <input
            type="text"
            class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
            placeholder="my-class another-class"
            [value]="currentData()['cssClasses'] || ''"
            (input)="updateData('cssClasses', $any($event.target).value)"
          />
        </div>

      </app-collapsible-section>
      } @case ('custom-cursor') {
        <!-- ... other sections ... -->
      } } }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedSettingsComponent {
  private builderState = inject(BuilderStateService);
  widgetType = input<string>('container');

  advancedOptions = computed(() => getAdvancedOptions(this.widgetType()));

  selectedBlock = computed(() => this.builderState.selectedBlock());

  currentStyles = computed(() => {
    const block = this.selectedBlock();
    const device = this.builderState.activeDevice();
    if (!block) return {} as BlockStyles;
    return block.styles[device] || block.styles.desktop || {};
  });

  currentData = computed(() => {
    return (this.selectedBlock()?.data || {}) as Record<string, any>;
  });

  updateStyle(property: keyof BlockStyles, value: string) {
    const blockId = this.builderState.selectedBlockId();
    const device = this.builderState.activeDevice();
    if (blockId) {
      this.builderState.updateBlockStyles(blockId, device, { [property]: value });
    }
  }

  updateData(property: string, value: string) {
    const blockId = this.builderState.selectedBlockId();
    const currentData = this.currentData();
    if (blockId) {
      this.builderState.updateBlock(blockId, { data: { ...currentData, [property]: value } });
    }
  }

  parseNumber(value: string | number | undefined): number {
    if (!value) return 0;
    return Number(value) || 0;
  }
}
