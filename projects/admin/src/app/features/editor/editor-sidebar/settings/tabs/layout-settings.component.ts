import { Component, ChangeDetectionStrategy, signal, input, inject, computed, effect } from '@angular/core';
import { SelectControlComponent } from '../controls/select-control.component';
import { IconListItemComponent } from '../components/icon-list-item.component';
import { ImageUploadComponent } from '../components/image-upload.component';
import { ContainerSettingsComponent } from '../components/container-settings.component';
import { GridSchemaSettingsComponent } from '../components/grid-schema-settings.component';
import { BuilderStateService } from '@admin/services/builder-state-service';
import { ImageContent, ButtonContent, IconListContent, TextContent } from 'page-builder';

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
              [options]="['vertical', 'horizontal']"
              [value]="iconListLayout()"
              (valueChange)="updateIconListLayout($event)"
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
            [imageUrl]="imageSrc()"
            (imageChange)="onImageChange($event)"
          />

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Lien de l'image</label>
            <input 
              type="text" 
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
              [value]="imageSrc() || ''"
              (input)="updateImageSrc($any($event.target).value)"
              placeholder="https://..."
            />
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Texte alternatif</label>
            <input 
              type="text" 
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
              [value]="imageAlt()"
              (input)="updateImageAlt($any($event.target).value)"
            />
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Légende</label>
            <input 
              type="text" 
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
              [value]="imageCaption()"
              (input)="updateImageCaption($any($event.target).value)"
            />
          </div>
        </div>

      } @else if (widgetType() === 'button') {
        <!-- Button Settings -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold">Bouton</h3>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Texte</label>
            <div class="flex items-center gap-2">
              <input 
                type="text" 
                class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" 
                [value]="buttonText()"
                (input)="updateButtonText($any($event.target).value)"
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Lien</label>
            <div class="flex items-center gap-2">
              <input 
                type="text" 
                class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" 
                [value]="buttonLink()"
                (input)="updateButtonLink($any($event.target).value)"
                placeholder="#"
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Icône</label>
            <input 
              type="text" 
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
              [value]="buttonIcon()"
              (input)="updateButtonIcon($any($event.target).value)"
              placeholder="Nom de l'icône (ex: add)"
            />
          </div>
          
          <app-select-control 
            label="Position de l'icône" 
            [options]="['left', 'right']"
            [value]="buttonIconPosition()"
            (valueChange)="updateButtonIconPosition($event)"
          />
        </div>

      } @else if (widgetType() === 'text') {
        <!-- Text Settings -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold">Texte</h3>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Contenu</label>
            <textarea 
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none min-h-[150px]"
              [value]="textContent()"
              (input)="updateTextContent($any($event.target).value)"
            ></textarea>
          </div>
          
          <app-select-control 
            label="Balise HTML" 
            [options]="['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span']"
            [value]="textTag()"
            (valueChange)="updateTextTag($event)"
          />
        </div>

      } @else if (widgetType() === 'heading') {
        <!-- Heading Settings -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold">Titre</h3>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Texte</label>
            <input 
              type="text" 
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
              [value]="headingText()"
              (input)="updateHeadingText($any($event.target).value)"
            />
          </div>
          
          <app-select-control 
            label="Niveau du titre" 
            [options]="['h1', 'h2', 'h3', 'h4', 'h5', 'h6']"
            [value]="headingTag()"
            (valueChange)="updateHeadingTag($event)"
          />
        </div>

      } @else if (widgetType() === 'spacer') {
        <!-- Spacer Settings -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold">Espaceur</h3>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Hauteur (px)</label>
            <input 
              type="number" 
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
              [value]="spacerHeight()"
              (input)="updateSpacerHeight($any($event.target).value)"
              min="10"
              max="500"
            />
          </div>
        </div>

      } @else if (widgetType() === 'divider') {
        <!-- Divider Settings -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold">Séparateur</h3>
          </div>

          <app-select-control 
            label="Style" 
            [options]="['solid', 'dashed', 'dotted', 'double']"
            [value]="dividerStyle()"
            (valueChange)="updateDividerStyle($event)"
          />
          
          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Largeur (%)</label>
            <input 
              type="number" 
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
              [value]="dividerWidth()"
              (input)="updateDividerWidth($any($event.target).value)"
              min="10"
              max="100"
            />
          </div>
        </div>

      } @else if (widgetType() === 'video') {
        <!-- Video Settings -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold">Vidéo</h3>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">URL (YouTube ou Vimeo)</label>
            <input 
              type="text" 
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
              [value]="videoSrc()"
              (input)="updateVideoSrc($any($event.target).value)"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div class="flex gap-4 mb-4">
            <label class="flex items-center gap-2 text-xs">
              <input 
                type="checkbox" 
                class="rounded border-gray-300"
                [checked]="videoAutoplay()"
                (change)="updateVideoAutoplay($any($event.target).checked)"
              />
              Lecture auto
            </label>
            <label class="flex items-center gap-2 text-xs">
              <input 
                type="checkbox" 
                class="rounded border-gray-300"
                [checked]="videoLoop()"
                (change)="updateVideoLoop($any($event.target).checked)"
              />
              Boucle
            </label>
            <label class="flex items-center gap-2 text-xs">
              <input 
                type="checkbox" 
                class="rounded border-gray-300"
                [checked]="videoMuted()"
                (change)="updateVideoMuted($any($event.target).checked)"
              />
              Muet
            </label>
          </div>
        </div>

      } @else if (widgetType() === 'container' || widgetType() === 'grid') {
        <!-- Layout Settings -->
        <app-container-settings [defaultOpen]="true" />
        <app-grid-schema-settings />
      } @else {
        <!-- Default message for unsupported widgets -->
        <div class="text-center text-gray-500 py-8">
          <span class="material-symbols-outlined text-3xl mb-2">info</span>
          <p class="text-sm">Aucun paramètre de contenu pour ce widget</p>
        </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSettingsComponent {
  private builderState = inject(BuilderStateService);
  widgetType = input<string>('layout');
  
  selectedBlock = computed(() => this.builderState.selectedBlock());

  // --- Icon List ---
  iconListItems = computed(() => {
    const data = this.selectedBlock()?.data as IconListContent;
    return data?.items || [];
  });

  iconListLayout = computed(() => {
    const data = this.selectedBlock()?.data as IconListContent;
    return data?.layout || 'vertical';
  });

  addIconListItem() {
    const currentItems = this.iconListItems();
    this.updateData({ 
      items: [...currentItems, { text: 'Nouvel élément', icon: 'check' }] 
    });
  }

  duplicateIconListItem(index: number) {
    const items = [...this.iconListItems()];
    items.splice(index + 1, 0, { ...items[index] });
    this.updateData({ items });
  }

  removeIconListItem(index: number) {
    const items = this.iconListItems().filter((_, i) => i !== index);
    this.updateData({ items });
  }

  updateIconListLayout(layout: string) {
    this.updateData({ layout });
  }

  // --- Image ---
  imageSrc = computed(() => {
    const data = this.selectedBlock()?.data as ImageContent;
    return data?.src || '';
  });

  imageAlt = computed(() => {
    const data = this.selectedBlock()?.data as ImageContent;
    return data?.alt || '';
  });

  imageCaption = computed(() => {
    const data = this.selectedBlock()?.data as ImageContent;
    return data?.caption || '';
  });

  onImageChange(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.updateData({ src: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  }

  updateImageSrc(src: string) {
    this.updateData({ src });
  }

  updateImageAlt(alt: string) {
    this.updateData({ alt });
  }

  updateImageCaption(caption: string) {
    this.updateData({ caption });
  }

  // --- Button ---
  buttonText = computed(() => {
    const data = this.selectedBlock()?.data as ButtonContent;
    return data?.text || 'Cliquez ici';
  });

  buttonLink = computed(() => {
    const data = this.selectedBlock()?.data as ButtonContent;
    return data?.link || '#';
  });

  buttonIcon = computed(() => {
    const data = this.selectedBlock()?.data as ButtonContent;
    return data?.icon || '';
  });

  buttonIconPosition = computed(() => {
    const data = this.selectedBlock()?.data as ButtonContent;
    return data?.iconPosition || 'left';
  });

  updateButtonText(text: string) {
    this.updateData({ text });
  }

  updateButtonLink(link: string) {
    this.updateData({ link });
  }

  updateButtonIcon(icon: string) {
    this.updateData({ icon });
  }

  updateButtonIconPosition(position: string) {
    this.updateData({ iconPosition: position });
  }

  // --- Text ---
  textContent = computed(() => {
    const data = this.selectedBlock()?.data as TextContent;
    return data?.text || '';
  });
  
  textTag = computed(() => {
    const data = this.selectedBlock()?.data as TextContent;
    return data?.tag || 'p';
  });

  updateTextContent(text: string) {
    this.updateData({ text });
  }
  
  updateTextTag(tag: string) {
    this.updateData({ tag });
  }

  // --- Heading ---
  headingText = computed(() => {
    const data = this.selectedBlock()?.data as TextContent;
    return data?.text || 'Nouveau Titre';
  });

  headingTag = computed(() => {
    const data = this.selectedBlock()?.data as TextContent;
    return data?.tag || 'h2';
  });

  updateHeadingText(text: string) {
    this.updateData({ text });
  }

  updateHeadingTag(tag: string) {
    this.updateData({ tag });
  }

  // --- Spacer ---
  spacerHeight = computed(() => {
    const data = this.selectedBlock()?.data as Record<string, any>;
    const height = data?.['height'] || '50px';
    return parseInt(height.replace(/[^\d]/g, '')) || 50;
  });

  updateSpacerHeight(height: string) {
    this.updateData({ height: `${height}px` });
  }

  // --- Divider ---
  dividerStyle = computed(() => {
    const data = this.selectedBlock()?.data as Record<string, any>;
    return data?.['style'] || 'solid';
  });

  dividerWidth = computed(() => {
    const data = this.selectedBlock()?.data as Record<string, any>;
    const width = data?.['width'] || '100%';
    return parseInt(width.replace(/[^\d]/g, '')) || 100;
  });

  updateDividerStyle(style: string) {
    this.updateData({ style });
  }

  updateDividerWidth(width: string) {
    this.updateData({ width: `${width}%` });
  }

  // --- Video ---
  videoSrc = computed(() => {
    const data = this.selectedBlock()?.data as Record<string, any>;
    return data?.['src'] || '';
  });

  videoAutoplay = computed(() => {
    const data = this.selectedBlock()?.data as Record<string, any>;
    return data?.['autoplay'] || false;
  });

  videoLoop = computed(() => {
    const data = this.selectedBlock()?.data as Record<string, any>;
    return data?.['loop'] || false;
  });

  videoMuted = computed(() => {
    const data = this.selectedBlock()?.data as Record<string, any>;
    return data?.['muted'] || false;
  });

  updateVideoSrc(src: string) {
    this.updateData({ src });
  }

  updateVideoAutoplay(autoplay: boolean) {
    this.updateData({ autoplay });
  }

  updateVideoLoop(loop: boolean) {
    this.updateData({ loop });
  }

  updateVideoMuted(muted: boolean) {
    this.updateData({ muted });
  }

  // --- Helper ---
  private updateData(updates: Record<string, any>) {
    const id = this.builderState.selectedBlockId();
    const currentData = this.selectedBlock()?.data || {};
    if (id) {
      this.builderState.updateBlock(id, { data: { ...currentData, ...updates } });
    }
  }
}
