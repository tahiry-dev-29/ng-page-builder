import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { ColorPickerControlComponent } from '../controls/color-picker-control.component';
import { SliderControlComponent } from '../controls/slider-control.component';
import { SelectControlComponent } from '../controls/select-control.component';
import { BuilderStateService } from '@admin/services/builder-state-service';
import { BlockStyles } from 'page-builder';

@Component({
  selector: 'app-style-settings',
  imports: [ColorPickerControlComponent, SliderControlComponent, SelectControlComponent],
  template: `
    <div class="p-4 overflow-y-auto h-full">
      @if (!selectedBlock()) {
        <div class="text-center text-gray-500 py-8">
          <span class="material-symbols-outlined text-3xl mb-2">touch_app</span>
          <p class="text-sm">Sélectionnez un élément pour modifier son style</p>
        </div>
      } @else {
        <!-- Arrière-plan Section -->
        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="backgroundOpen.set(!backgroundOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!backgroundOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Arrière-plan</h3>
          </div>

          @if (backgroundOpen()) {
            <app-color-picker-control 
              label="Couleur de fond"
              [value]="currentStyles().backgroundColor || ''"
              (valueChange)="updateStyle('backgroundColor', $event)"
            />
          }
        </div>

        <!-- Typographie Section -->
        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="typographyOpen.set(!typographyOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!typographyOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Typographie</h3>
          </div>

          @if (typographyOpen()) {
            <app-select-control 
              label="Famille de police"
              [options]="fontFamilies"
              [value]="currentStyles().fontFamily || 'inherit'"
              (valueChange)="updateStyle('fontFamily', $event)"
            />

            <app-slider-control 
              label="Taille" 
              [min]="8" 
              [max]="100" 
              [value]="parseFontSize()"
              [unit]="'px'"
              [availableUnits]="['px', 'em', 'rem']"
              (valueChange)="updateStyle('fontSize', $event)"
            />

            <app-select-control 
              label="Graisse"
              [options]="fontWeights"
              [value]="currentStyles().fontWeight || 'normal'"
              (valueChange)="updateStyle('fontWeight', $event)"
            />
            
            <app-color-picker-control 
              label="Couleur du texte"
              [value]="currentStyles().color || ''"
              (valueChange)="updateStyle('color', $event)"
            />
          }
        </div>

        <!-- Espacement Section -->
        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="spacingOpen.set(!spacingOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!spacingOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Espacement</h3>
          </div>

          @if (spacingOpen()) {
            <app-slider-control 
              label="Padding" 
              [min]="0" 
              [max]="100" 
              [value]="parseNumber(currentStyles().padding)"
              (valueChange)="updateStyle('padding', $event)"
            />

            <app-slider-control 
              label="Margin" 
              [min]="0" 
              [max]="100" 
              [value]="parseNumber(currentStyles().margin)"
              (valueChange)="updateStyle('margin', $event)"
            />

            <app-slider-control 
              label="Gap" 
              [min]="0" 
              [max]="50" 
              [value]="parseNumber(currentStyles().gap)"
              (valueChange)="updateStyle('gap', $event)"
            />
          }
        </div>

        <!-- Bordure Section -->
        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="borderOpen.set(!borderOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!borderOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Bordure</h3>
          </div>

          @if (borderOpen()) {
            <app-slider-control 
              label="Rayon" 
              [min]="0" 
              [max]="50" 
              [value]="parseNumber(currentStyles().borderRadius)"
              (valueChange)="updateStyle('borderRadius', $event)"
            />
            
            <app-color-picker-control 
              label="Couleur de bordure"
              [value]="currentStyles().borderColor || ''"
              (valueChange)="updateBorder($event)"
            />
          }
        </div>

        <!-- Taille Section -->
        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="sizeOpen.set(!sizeOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!sizeOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Taille</h3>
          </div>

          @if (sizeOpen()) {
            <app-slider-control 
              label="Largeur" 
              [min]="0" 
              [max]="100" 
              [unit]="'%'"
              [availableUnits]="['%', 'px', 'vw']"
              [value]="parseNumber(currentStyles().width)"
              (valueChange)="updateStyle('width', $event)"
            />

            <app-slider-control 
              label="Hauteur min" 
              [min]="0" 
              [max]="500" 
              [value]="parseNumber(currentStyles().minHeight)"
              (valueChange)="updateStyle('minHeight', $event)"
            />
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StyleSettingsComponent {
  private builderState = inject(BuilderStateService);

  backgroundOpen = signal(true);
  typographyOpen = signal(true);
  spacingOpen = signal(true);
  borderOpen = signal(false);
  sizeOpen = signal(false);

  fontFamilies = ['inherit', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana', 'Roboto', 'Open Sans'];
  fontWeights = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

  selectedBlock = computed(() => this.builderState.selectedBlock());
  
  currentStyles = computed(() => {
    const block = this.selectedBlock();
    const device = this.builderState.activeDevice();
    if (!block) return {} as BlockStyles;
    return block.styles[device] || block.styles.desktop || {};
  });

  parseFontSize(): number {
    const size = this.currentStyles().fontSize;
    if (!size) return 16;
    return parseInt(size.replace(/[^\d]/g, '')) || 16;
  }

  parseNumber(value: string | undefined): number {
    if (!value) return 0;
    return parseInt(value.replace(/[^\d]/g, '')) || 0;
  }

  updateStyle(property: keyof BlockStyles, value: string) {
    const blockId = this.builderState.selectedBlockId();
    if (!blockId) return;
    
    const device = this.builderState.activeDevice();
    this.builderState.updateBlockStyles(blockId, device, { [property]: value });
  }

  updateBorder(color: string) {
    const blockId = this.builderState.selectedBlockId();
    if (!blockId) return;
    
    const device = this.builderState.activeDevice();
    this.builderState.updateBlockStyles(blockId, device, { 
      borderColor: color,
      borderWidth: '1px',
      borderStyle: 'solid'
    });
  }
}
