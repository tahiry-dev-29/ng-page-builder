import { Component, ChangeDetectionStrategy, signal, input } from '@angular/core';
import { SelectControlComponent } from '../controls/select-control.component';
import { SliderControlComponent } from '../controls/slider-control.component';
import { TextInputComponent } from '../controls/text-input.component';
import { IconPickerComponent } from '../controls/icon-picker.component';
import { ImagePickerComponent } from '../controls/image-picker.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout-settings',
  standalone: true,
  imports: [
    SelectControlComponent, 
    SliderControlComponent, 
    TextInputComponent,
    IconPickerComponent,
    ImagePickerComponent,
    FormsModule
  ],
  template: `
    <div class="p-4 overflow-y-auto h-full">
      @if (widgetType() === 'icon-list') {
        <!-- Icon List Settings -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold">Liste d'icône</h3>
          </div>

          <div class="space-y-2 mb-4">
            @for (item of iconListItems(); track $index) {
              <div class="border border-gray-200 rounded bg-white">
                <div class="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">{{ item.icon }}</span>
                    <span class="text-xs font-medium">{{ item.text }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <button class="p-1 hover:bg-gray-200 rounded text-gray-500">
                      <span class="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                    <button 
                      class="p-1 hover:bg-gray-200 rounded text-gray-500"
                      (click)="removeIconListItem($index)"
                    >
                      <span class="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>

          <button 
            class="w-full py-2 bg-gray-600 text-white rounded text-xs font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 mb-6"
            (click)="addIconListItem()"
          >
            <span class="material-symbols-outlined text-sm">add</span>
            Ajouter un élément
          </button>

          <div class="border-t border-gray-200 pt-4">
            <app-select-control label="Mise en page" [options]="iconListLayouts()" />
          </div>
        </div>
        
      } @else if (widgetType() === 'image') {
        <!-- Image Settings -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold">Image</h3>
          </div>

          <app-image-picker label="Choisir une image" />
          <app-select-control label="Résolution de l'image" [options]="imageResolutions()" />
          <app-select-control label="Légende" [options]="imageCaptions()" />
          <app-select-control label="Lien" [options]="imageLinks()" />
        </div>

      } @else if (widgetType() === 'button') {
        <!-- Button Settings -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold">Bouton</h3>
          </div>

          <app-select-control label="Type" [options]="buttonTypes()" />
          <app-text-input label="Texte" value="Cliquez ici" [showDatabaseButton]="true" />
          <app-text-input label="Lien" placeholder="#" [showDatabaseButton]="true" [showSettingsButton]="true" />
          <app-icon-picker label="Icône" />
          <app-text-input 
            label="ID du bouton" 
            [showDatabaseButton]="true"
            helpText="Veuillez vous assurer que l'ID est unique et non utilisé ailleurs sur la page. Ce champ autorise les caractères A-z 0-9 et underscores sans espace."
          />
        </div>

      } @else if (widgetType() === 'layout') {
        <!-- Conteneur Section -->
        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="containerOpen.set(!containerOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!containerOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Conteneur</h3>
          </div>

          @if (containerOpen()) {
            <app-select-control label="Mise en page du conteneur" [options]="containerLayouts()" />
            <app-select-control label="Largeur du contenu" [options]="contentWidths()" />
            <app-slider-control label="Largeur" [min]="0" [max]="2000" unit="px" />
            <app-slider-control label="Hauteur mini" [min]="0" [max]="1000" unit="px" />
            <p class="text-[10px] text-gray-400 italic mb-4">Pour atteindre la pleine hauteur du conteneur, utilisez 100vh.</p>
          }
        </div>

        <!-- Éléments Section -->
        <div class="mb-6">
          <h3 class="text-sm font-bold mb-3">Éléments</h3>

          <!-- Schéma de la grille -->
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-medium text-gray-600">Schéma de la grille</label>
              <button 
                class="px-3 py-1 text-xs rounded transition-colors"
                [class.bg-purple-100]="gridSchemaEnabled()"
                [class.text-purple-600]="gridSchemaEnabled()"
                [class.bg-gray-100]="!gridSchemaEnabled()"
                [class.text-gray-600]="!gridSchemaEnabled()"
                (click)="gridSchemaEnabled.set(!gridSchemaEnabled())"
              >
                {{ gridSchemaEnabled() ? 'Affiché' : 'Masqué' }}
              </button>
            </div>
          </div>

          @if (gridSchemaEnabled()) {
            <!-- Colonnes -->
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <label class="text-xs font-medium text-gray-600">Colonnes</label>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-gray-400 text-sm">desktop_windows</span>
                  <div class="flex items-center">
                    <span class="text-xs text-gray-400 mr-1">fr</span>
                    <span class="material-symbols-outlined text-gray-400 text-xs cursor-pointer">expand_more</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  [value]="columns()"
                  (input)="columns.set(+$any($event.target).value)"
                  class="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                >
                <input 
                  type="number" 
                  [value]="columns()"
                  (input)="columns.set(+$any($event.target).value)"
                  class="w-16 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:border-blue-500 outline-none"
                >
              </div>
            </div>

            <!-- Lignes -->
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <label class="text-xs font-medium text-gray-600">Lignes</label>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-gray-400 text-sm">desktop_windows</span>
                  <div class="flex items-center">
                    <span class="text-xs text-gray-400 mr-1">fr</span>
                    <span class="material-symbols-outlined text-gray-400 text-xs cursor-pointer">expand_more</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  [value]="rows()"
                  (input)="rows.set(+$any($event.target).value)"
                  class="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                >
                <input 
                  type="number" 
                  [value]="rows()"
                  (input)="rows.set(+$any($event.target).value)"
                  class="w-16 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:border-blue-500 outline-none"
                >
              </div>
            </div>

            <!-- Écarts -->
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <label class="text-xs font-medium text-gray-600">Écarts</label>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-gray-400 text-sm">desktop_windows</span>
                  <span class="text-xs text-gray-400">px</span>
                  <span class="material-symbols-outlined text-gray-400 text-xs cursor-pointer">expand_more</span>
                </div>
              </div>
              <div class="flex gap-1">
                <div class="flex-1">
                  <input type="number" class="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center focus:border-blue-500 outline-none" placeholder="">
                  <div class="text-[10px] text-gray-400 text-center mt-1">Colonne</div>
                </div>
                <div class="flex-1">
                  <input type="number" class="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center focus:border-blue-500 outline-none" placeholder="">
                  <div class="text-[10px] text-gray-400 text-center mt-1">Ligne</div>
                </div>
                <div class="flex items-start pt-1">
                  <button class="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
                    <span class="material-symbols-outlined text-sm text-gray-600">link</span>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSettingsComponent {
  widgetType = input<string>('layout');
  
  // Container settings
  containerOpen = signal(true);
  gridSchemaEnabled = signal(true);
  columns = signal(3);
  rows = signal(2);

  // Data for select options (using @for in SelectControlComponent)
  containerLayouts = signal(['Grille', 'Flex', 'Block']);
  contentWidths = signal(['Encadré', 'Pleine largeur']);
  
  imageResolutions = signal(['Large - 1024 x 1024', 'Moyenne - 300 x 300', 'Miniature - 150 x 150', 'Entier']);
  imageCaptions = signal(['Aucun', 'Légende de la pièce jointe', 'Légende personnalisée']);
  imageLinks = signal(['Aucun', 'Fichier média', 'URL personnalisée']);
  
  buttonTypes = signal(['Par défaut', 'Info', 'Succès', 'Avertissement', 'Danger']);
  
  iconListLayouts = signal(['Par défaut', 'Intégré']);

  // Icon List settings
  iconListItems = signal([
    { text: 'Élément de liste #1', icon: 'check' },
    { text: 'Élément de liste #2', icon: 'close' },
    { text: 'Élément de liste #3', icon: 'circle' }
  ]);

  addIconListItem() {
    this.iconListItems.update(items => [...items, { text: 'Nouvel élément', icon: 'check' }]);
  }

  removeIconListItem(index: number) {
    this.iconListItems.update(items => items.filter((_, i) => i !== index));
  }
}
