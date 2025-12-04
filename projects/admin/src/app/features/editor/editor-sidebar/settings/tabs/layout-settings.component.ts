import { Component, ChangeDetectionStrategy, signal, input } from '@angular/core';
import { SelectControlComponent } from '../controls/select-control.component';
import { IconListItemComponent } from '../components/icon-list-item.component';
import { ImageUploadComponent } from '../components/image-upload.component';
import { ContainerSettingsComponent } from '../components/container-settings.component';
import { GridSchemaSettingsComponent } from '../components/grid-schema-settings.component';

@Component({
  selector: 'app-layout-settings',
  imports: [
    SelectControlComponent,
    IconListItemComponent,
    ImageUploadComponent,
    ContainerSettingsComponent,
    GridSchemaSettingsComponent
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
              <app-icon-list-item
                [icon]="item.icon"
                [text]="item.text"
                [index]="$index"
                (duplicate)="duplicateIconListItem($event)"
                (remove)="removeIconListItem($event)"
              />
            }
          </div>

          <button 
            class="w-full py-2 bg-gray-600 text-white rounded text-xs font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 mb-6"
            (click)="addIconListItem()"
            type="button"
          >
            <span class="material-symbols-outlined text-sm">add</span>
            Ajouter un élément
          </button>

          <div class="border-t border-gray-200 pt-4">
            <app-select-control 
              label="Mise en page" 
              [options]="iconListLayoutOptions()"
            />
          </div>
        </div>

      } @else if (widgetType() === 'image') {
        <!-- Image Settings -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold">Image</h3>
          </div>

          <app-image-upload 
            [imageUrl]="currentImage()"
            (imageChange)="onImageChange($event)"
          />

          <app-select-control 
            label="Résolution de l'image" 
            [options]="imageResolutionOptions()"
          />

          <app-select-control 
            label="Légende" 
            [options]="imageCaptionOptions()"
          />

          <app-select-control 
            label="Lien" 
            [options]="imageLinkOptions()"
          />
        </div>

      } @else if (widgetType() === 'button') {
        <!-- Button Settings -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold">Bouton</h3>
          </div>

          <app-select-control 
            label="Type" 
            [options]="buttonTypeOptions()"
          />

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Texte</label>
            <div class="flex items-center gap-2">
              <input 
                type="text" 
                class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" 
                value="Cliquez ici"
              />
              <button class="p-2 hover:bg-gray-100 rounded text-gray-500" type="button">
                <span class="material-symbols-outlined text-sm">database</span>
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Lien</label>
            <div class="flex items-center gap-2">
              <input 
                type="text" 
                class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" 
                placeholder="#"
              />
              <button class="p-2 hover:bg-gray-100 rounded text-gray-500" type="button">
                <span class="material-symbols-outlined text-sm">settings</span>
              </button>
              <button class="p-2 hover:bg-gray-100 rounded text-gray-500" type="button">
                <span class="material-symbols-outlined text-sm">database</span>
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Icône</label>
            <div class="flex items-center gap-2">
              <div class="flex-1 flex items-center justify-end gap-1">
                <button class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700" type="button">
                  <span class="material-symbols-outlined text-sm">block</span>
                </button>
                <button class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700" type="button">
                  <span class="material-symbols-outlined text-sm">upload</span>
                </button>
                <button class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700" type="button">
                  <span class="material-symbols-outlined text-sm">circle</span>
                </button>
              </div>
            </div>
          </div>

          <div class="mb-4 pt-4 border-t border-gray-200">
            <label class="block text-xs font-medium text-gray-600 mb-2">ID du bouton</label>
            <div class="flex items-center gap-2">
              <input 
                type="text" 
                class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
              />
              <button class="p-2 hover:bg-gray-100 rounded text-gray-500" type="button">
                <span class="material-symbols-outlined text-sm">database</span>
              </button>
            </div>
            <p class="text-[10px] text-gray-400 italic mt-2">
              Veuillez vous assurer que l'ID est unique et non utilisé ailleurs sur la page. Ce champ autorise les caractères A-z 0-9 et underscores sans espace.
            </p>
          </div>
        </div>

      } @else if (widgetType() === 'layout') {
        <!-- Layout Settings -->
        <app-container-settings [defaultOpen]="true" />
        <app-grid-schema-settings />
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSettingsComponent {
  widgetType = input<string>('layout');
  
  // Icon List
  iconListItems = signal([
    { text: 'Élément de liste #1', icon: 'check' },
    { text: 'Élément de liste #2', icon: 'close' },
    { text: 'Élément de liste #3', icon: 'circle' }
  ]);
  
  iconListLayoutOptions = signal(['Par défaut', 'Intégré']);
  
  // Image
  currentImage = signal<string | null>(null);
  imageResolutionOptions = signal([
    'Large - 1024 x 1024',
    'Moyenne - 300 x 300',
    'Miniature - 150 x 150',
    'Entier'
  ]);
  imageCaptionOptions = signal([
    'Aucun',
    'Légende de la pièce jointe',
    'Légende personnalisée'
  ]);
  imageLinkOptions = signal([
    'Aucun',
    'Fichier média',
    'URL personnalisée'
  ]);
  
  // Button
  buttonTypeOptions = signal([
    'Par défaut',
    'Info',
    'Succès',
    'Avertissement',
    'Danger'
  ]);

  addIconListItem() {
    this.iconListItems.update(items => [...items, { text: 'Nouvel élément', icon: 'check' }]);
  }

  duplicateIconListItem(index: number) {
    const item = this.iconListItems()[index];
    this.iconListItems.update(items => [
      ...items.slice(0, index + 1),
      { ...item },
      ...items.slice(index + 1)
    ]);
  }

  removeIconListItem(index: number) {
    this.iconListItems.update(items => items.filter((_, i) => i !== index));
  }
  
  onImageChange(file: File) {
    // Handle image upload
    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentImage.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
}
