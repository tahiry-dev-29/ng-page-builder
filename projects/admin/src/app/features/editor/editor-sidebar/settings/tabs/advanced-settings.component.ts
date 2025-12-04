import { Component, ChangeDetectionStrategy, input, computed, signal } from '@angular/core';
import { DimensionControlComponent } from '../controls/dimension-control.component';
import { SelectControlComponent } from '../controls/select-control.component';
import { CollapsibleSectionComponent } from '../components/collapsible-section.component';
import { getAdvancedOptions, AdvancedOption } from '../advanced-options-registry';

@Component({
  selector: 'app-advanced-settings',
  standalone: true,
  imports: [DimensionControlComponent, SelectControlComponent, CollapsibleSectionComponent],
  template: `
    <div class="p-4 overflow-y-auto h-full">
      @for (option of advancedOptions(); track option.id) { @switch (option.id) { @case ('layout') {
      <app-collapsible-section [title]="option.label" [icon]="option.icon" [defaultOpen]="true">
        <!-- Marge -->
        <app-dimension-control label="Marge" />

        <!-- Padding -->
        <app-dimension-control label="Padding" />

        <!-- Largeur -->
        <app-select-control label="Largeur" [options]="widthOptions()" />

        <!-- Alignement automatique -->
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">Alignement automatique</label>
          <div class="flex gap-2">
            <button class="flex-1 p-2 border border-gray-300 rounded text-xs hover:bg-gray-50">
              <span class="material-symbols-outlined text-sm">format_align_left</span>
            </button>
            <button class="flex-1 p-2 border border-gray-300 rounded text-xs hover:bg-gray-50">
              <span class="material-symbols-outlined text-sm">format_align_center</span>
            </button>
            <button class="flex-1 p-2 border border-gray-300 rounded text-xs hover:bg-gray-50">
              <span class="material-symbols-outlined text-sm">format_align_right</span>
            </button>
          </div>
        </div>

        <!-- Ordre -->
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">Ordre</label>
          <input
            type="number"
            class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
            value="0"
          />
        </div>

        <!-- Taille -->
        <app-select-control label="Taille" [options]="sizeOptions()" />

        <!-- Position -->
        <app-select-control label="Position" [options]="positionOptions()" />

        <!-- Z-Index -->
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">Z-Index</label>
          <input
            type="number"
            class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
            value="0"
          />
        </div>

        <!-- ID CSS -->
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">ID CSS</label>
          <input
            type="text"
            class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
            placeholder="element-id"
          />
        </div>
      </app-collapsible-section>
      } @case ('custom-cursor') {
      <app-collapsible-section
        [title]="option.label"
        [icon]="option.icon || ''"
        [isPro]="option.isPro || false"
      >
        <p class="text-xs text-gray-500">Personnalisez le curseur pour cet élément</p>
      </app-collapsible-section>
      } @case ('wrapper-link') {
      <app-collapsible-section
        [title]="option.label"
        [icon]="option.icon || ''"
        [isPro]="option.isPro || false"
      >
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">Lien</label>
          <input
            type="url"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
            placeholder="https://"
          />
        </div>
        <div class="mb-4">
          <label class="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" class="rounded" />
            <span>Ouvrir dans un nouvel onglet</span>
          </label>
        </div>
        <div class="mb-4">
          <label class="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" class="rounded" />
            <span>Attribut nofollow</span>
          </label>
        </div>
      </app-collapsible-section>
      } @case ('liquid-glass') {
      <app-collapsible-section
        [title]="option.label"
        [icon]="option.icon || ''"
        [isPro]="option.isPro || false"
      >
        <p class="text-xs text-gray-500">Effets de verre liquide</p>
      </app-collapsible-section>
      } @case ('image-masking') {
      <app-collapsible-section
        [title]="option.label"
        [icon]="option.icon || ''"
        [isPro]="option.isPro || false"
      >
        <p class="text-xs text-gray-500">Masquage d'image</p>
      </app-collapsible-section>
      } @case ('sticky-section') {
      <app-collapsible-section
        [title]="option.label"
        [icon]="option.icon || ''"
        [isPro]="option.isPro || false"
      >
        <p class="text-xs text-gray-500">Section collante</p>
      </app-collapsible-section>
      } @case ('onepage-scroll') {
      <app-collapsible-section
        [title]="option.label"
        [icon]="option.icon || ''"
        [isPro]="option.isPro || false"
      >
        <p class="text-xs text-gray-500">Défilement d'une page</p>
      </app-collapsible-section>
      } @case ('motion-effects') {
      <app-collapsible-section
        [title]="option.label"
        [icon]="option.icon || ''"
        [isPro]="option.isPro || false"
      >
        <p class="text-xs text-gray-500">Effets de mouvement et animations</p>
      </app-collapsible-section>
      } @case ('transformer') {
      <app-collapsible-section
        [title]="option.label"
        [icon]="option.icon || ''"
        [isPro]="option.isPro || false"
      >
        <p class="text-xs text-gray-500">Transformations CSS (rotate, scale, etc.)</p>
      </app-collapsible-section>
      } @case ('responsive') {
      <app-collapsible-section
        [title]="option.label"
        [icon]="option.icon || ''"
        [isPro]="option.isPro || false"
      >
        <div class="mb-4">
          <label class="flex items-center gap-2 text-xs text-gray-600">
            <input type="checkbox" class="rounded" />
            <span>Masquer sur mobile</span>
          </label>
        </div>
        <div class="mb-4">
          <label class="flex items-center gap-2 text-xs text-gray-600">
            <input type="checkbox" class="rounded" />
            <span>Masquer sur tablette</span>
          </label>
        </div>
        <div class="mb-4">
          <label class="flex items-center gap-2 text-xs text-gray-600">
            <input type="checkbox" class="rounded" />
            <span>Masquer sur desktop</span>
          </label>
        </div>
      </app-collapsible-section>
      } @case ('attributes') {
      <app-collapsible-section
        [title]="option.label"
        [icon]="option.icon || ''"
        [isPro]="option.isPro || false"
      >
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">Attributs HTML</label>
          <textarea
            class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none font-mono"
            rows="3"
            placeholder='data-attribute="value"'
          ></textarea>
        </div>
      </app-collapsible-section>
      } @case ('custom-css') {
      <app-collapsible-section
        [title]="option.label"
        [icon]="option.icon || ''"
        [isPro]="option.isPro || false"
      >
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">CSS personnalisé</label>
          <textarea
            class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none font-mono"
            rows="5"
            placeholder="selector { }"
          ></textarea>
        </div>
      </app-collapsible-section>
      } } }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedSettingsComponent {
  widgetType = input<string>('container');

  advancedOptions = computed(() => getAdvancedOptions(this.widgetType()));

  // Options arrays
  widthOptions = signal(['Par défaut', 'Pleine largeur', 'Personnalisé']);
  sizeOptions = signal(['Par défaut', 'Personnalisé']);
  positionOptions = signal(['Par défaut', 'Absolute', 'Fixed']);
}
