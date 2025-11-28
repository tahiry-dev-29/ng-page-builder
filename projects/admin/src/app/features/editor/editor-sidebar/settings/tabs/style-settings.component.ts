import { Component, ChangeDetectionStrategy, signal, input } from '@angular/core';
import { ColorPickerControlComponent } from '../controls/color-picker-control.component';
import { BorderControlComponent } from '../controls/border-control.component';
import { SliderControlComponent } from '../controls/slider-control.component';
import { SelectControlComponent } from '../controls/select-control.component';

@Component({
  selector: 'app-style-settings',
  standalone: true,
  imports: [ColorPickerControlComponent, BorderControlComponent, SliderControlComponent, SelectControlComponent],
  template: `
    <div class="p-4 overflow-y-auto h-full">
      @if (widgetType() === 'icon-list') {
        <!-- Liste Section -->
        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="listOpen.set(!listOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!listOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Liste</h3>
          </div>

          @if (listOpen()) {
            <app-slider-control label="Espace entre" [min]="0" [max]="100" unit="px" />
            
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-600 mb-2">Alignement</label>
              <div class="flex gap-1">
                <button class="flex-1 p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <span class="material-symbols-outlined text-sm">format_align_left</span>
                </button>
                <button class="flex-1 p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <span class="material-symbols-outlined text-sm">format_align_center</span>
                </button>
                <button class="flex-1 p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <span class="material-symbols-outlined text-sm">format_align_right</span>
                </button>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-600 mb-2">Diviseur</label>
              <div class="flex items-center gap-2">
                <input type="checkbox" class="rounded">
                <span class="text-xs text-gray-600">Activé</span>
              </div>
            </div>
          }
        </div>

        <!-- Icône Section -->
        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="iconOpen.set(!iconOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!iconOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Icône</h3>
          </div>

          @if (iconOpen()) {
            <app-color-picker-control label="Couleur" />
            <app-color-picker-control label="Couleur au survol" />
            <app-slider-control label="Taille" [min]="0" [max]="100" unit="px" />
            <app-slider-control label="Écart" [min]="0" [max]="50" unit="px" />
            
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-600 mb-2">Alignement vertical</label>
              <div class="flex gap-1">
                <button class="flex-1 p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <span class="material-symbols-outlined text-sm">vertical_align_top</span>
                </button>
                <button class="flex-1 p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <span class="material-symbols-outlined text-sm">vertical_align_center</span>
                </button>
                <button class="flex-1 p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <span class="material-symbols-outlined text-sm">vertical_align_bottom</span>
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Texte Section -->
        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="textOpen.set(!textOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!textOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Texte</h3>
          </div>

          @if (textOpen()) {
            <app-color-picker-control label="Couleur du texte" />
            <app-color-picker-control label="Couleur au survol" />
            <app-slider-control label="Retrait du texte" [min]="0" [max]="100" unit="px" />
            
            <div class="mt-4">
              <h4 class="text-xs font-bold mb-2">Typographie</h4>
              <app-select-control label="Famille de police">
                <option>Par défaut</option>
                <option>Roboto</option>
                <option>Open Sans</option>
              </app-select-control>
              <app-slider-control label="Taille" [min]="8" [max]="100" unit="px" />
              <app-select-control label="Graisse">
                <option>Normal</option>
                <option>Bold</option>
              </app-select-control>
            </div>
          }
        </div>

      } @else if (widgetType() === 'image') {
        <!-- Image Style Settings -->
        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="imageStyleOpen.set(!imageStyleOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!imageStyleOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Image</h3>
          </div>

          @if (imageStyleOpen()) {
            <app-slider-control label="Largeur" [min]="0" [max]="100" unit="%" />
            <app-slider-control label="Largeur max" [min]="0" [max]="100" unit="%" />
            <app-slider-control label="Opacité" [min]="0" [max]="1" step="0.1" unit="" />
            
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-600 mb-2">Filtres CSS</label>
              <button class="p-1 hover:bg-gray-100 rounded text-gray-500">
                <span class="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
          }
        </div>

        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="borderOpen.set(!borderOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!borderOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Bordure</h3>
          </div>
          @if (borderOpen()) {
            <app-border-control />
            <div class="mt-4">
               <app-slider-control label="Rayon de bordure" [min]="0" [max]="100" unit="px" />
            </div>
            <div class="mt-4">
               <label class="block text-xs font-medium text-gray-600 mb-2">Ombre de boîte</label>
               <button class="p-1 hover:bg-gray-100 rounded text-gray-500">
                <span class="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
          }
        </div>

      } @else if (widgetType() === 'button') {
        <!-- Button Style Settings -->
        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="typographyOpen.set(!typographyOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!typographyOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Typographie</h3>
          </div>

          @if (typographyOpen()) {
            <app-select-control label="Famille de police">
              <option>Par défaut</option>
              <option>Roboto</option>
            </app-select-control>
            <app-slider-control label="Taille" [min]="8" [max]="100" unit="px" />
          }
        </div>

        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer">
            <span class="material-symbols-outlined text-sm mr-2">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Ombre de texte</h3>
          </div>
        </div>

        <div class="mb-6">
          <div class="flex border-b border-gray-200 mb-4">
            <button class="flex-1 py-2 text-xs font-medium border-b-2 border-black text-black">Normal</button>
            <button class="flex-1 py-2 text-xs font-medium border-b-2 border-transparent text-gray-500">Au survol</button>
          </div>

          <app-color-picker-control label="Couleur du texte" />
          
          <div class="mb-4 mt-4">
            <label class="block text-xs font-medium text-gray-600 mb-2">Type d'arrière-plan</label>
            <div class="flex gap-1">
              <button class="flex-1 p-2 border border-gray-300 rounded bg-gray-100">Classique</button>
              <button class="flex-1 p-2 border border-gray-300 rounded">Dégradé</button>
            </div>
          </div>
          
          <app-color-picker-control label="Couleur" />
        </div>

        <div class="mb-6">
          <div class="flex items-center mb-3 cursor-pointer" (click)="borderOpen.set(!borderOpen())">
            <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!borderOpen()">arrow_drop_down</span>
            <h3 class="text-sm font-bold">Bordure</h3>
          </div>
          @if (borderOpen()) {
            <app-border-control />
            <div class="mt-4">
               <app-slider-control label="Rayon de bordure" [min]="0" [max]="100" unit="px" />
            </div>
          }
        </div>
        
        <div class="mb-6">
           <app-slider-control label="Padding" [min]="0" [max]="100" unit="px" />
        </div>

      } @else {
        <!-- Arrière-plan Section -->
        <div class="mb-6">
        <div class="flex items-center mb-3 cursor-pointer" (click)="backgroundOpen.set(!backgroundOpen())">
          <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!backgroundOpen()">arrow_drop_down</span>
          <h3 class="text-sm font-bold">Arrière-plan</h3>
        </div>

        @if (backgroundOpen()) {
          <!-- Background Type -->
          <div class="mb-3">
            <label class="block text-xs font-medium text-gray-600 mb-2">Type</label>
            <div class="flex gap-1">
              <button 
                class="flex-1 p-2 border rounded text-xs transition-colors"
                [class.border-blue-500]="bgType() === 'none'"
                [class.bg-blue-50]="bgType() === 'none'"
                [class.border-gray-300]="bgType() !== 'none'"
                (click)="bgType.set('none')"
              >
                Aucun
              </button>
              <button 
                class="flex-1 p-2 border rounded text-xs transition-colors"
                [class.border-blue-500]="bgType() === 'classic'"
                [class.bg-blue-50]="bgType() === 'classic'"
                [class.border-gray-300]="bgType() !== 'classic'"
                (click)="bgType.set('classic')"
              >
                Classique
              </button>
              <button 
                class="flex-1 p-2 border rounded text-xs transition-colors"
                [class.border-blue-500]="bgType() === 'gradient'"
                [class.bg-blue-50]="bgType() === 'gradient'"
                [class.border-gray-300]="bgType() !== 'gradient'"
                (click)="bgType.set('gradient')"
              >
                Dégradé
              </button>
            </div>
          </div>

          @if (bgType() === 'classic') {
            <app-color-picker-control label="Couleur" />
            
            <!-- Image -->
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-600 mb-2">Image</label>
              <button class="w-full p-3 border-2 border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-base">add_photo_alternate</span>
                <span>Choisir une image</span>
              </button>
            </div>
          }

          @if (bgType() === 'gradient') {
            <app-color-picker-control label="Couleur 1" />
            <app-color-picker-control label="Couleur 2" />
            
            <!-- Gradient Type -->
            <app-select-control label="Type">
              <option>Linéaire</option>
              <option>Radial</option>
            </app-select-control>

            <!-- Angle -->
            <app-slider-control label="Angle" [min]="0" [max]="360" unit="deg" />
          }
        }
      </div>

      <!-- Bordure Section -->
      <div class="mb-6">
        <div class="flex items-center mb-3 cursor-pointer" (click)="borderOpen.set(!borderOpen())">
          <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!borderOpen()">arrow_drop_down</span>
          <h3 class="text-sm font-bold">Bordure</h3>
        </div>

        @if (borderOpen()) {
          <app-border-control />
        }
      </div>

      <!-- Ombre de boîte Section -->
      <div class="mb-6">
        <div class="flex items-center mb-3 cursor-pointer" (click)="shadowOpen.set(!shadowOpen())">
          <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!shadowOpen()">arrow_drop_down</span>
          <h3 class="text-sm font-bold">Ombre de boîte</h3>
        </div>

        @if (shadowOpen()) {
          <app-color-picker-control label="Couleur" />
          <app-slider-control label="Décalage horizontal" [min]="-100" [max]="100" unit="px" />
          <app-slider-control label="Décalage vertical" [min]="-100" [max]="100" unit="px" />
          <app-slider-control label="Flou" [min]="0" [max]="100" unit="px" />
          <app-slider-control label="Étalement" [min]="-100" [max]="100" unit="px" />
        }
      </div>

      <!-- Typographie Section (optionnel) -->
      <div class="mb-6">
        <div class="flex items-center mb-3 cursor-pointer" (click)="typographyOpen.set(!typographyOpen())">
          <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!typographyOpen()">arrow_drop_down</span>
          <h3 class="text-sm font-bold">Typographie</h3>
        </div>

        @if (typographyOpen()) {
          <app-select-control label="Famille de police">
            @for (font of fonts(); track font) {
              <option>{{ font }}</option>
            }
          </app-select-control>

          <app-slider-control label="Taille" [min]="8" [max]="100" unit="px" />

          <app-select-control label="Graisse">
            @for (style of styles(); track style) {
              <option>{{ style }}</option>
            }
          </app-select-control>

          <app-slider-control label="Hauteur de ligne" [min]="1" [max]="3" unit="em" />
          <app-slider-control label="Espacement des lettres" [min]="-5" [max]="10" unit="px" />
          
          <app-color-picker-control label="Couleur du texte" />
        }
        </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StyleSettingsComponent {
  widgetType = input<string>('layout');

  backgroundOpen = signal(true);
  borderOpen = signal(true);
  shadowOpen = signal(false);
  typographyOpen = signal(false);
  
  // Icon List specific
  listOpen = signal(true);
  iconOpen = signal(true);
  textOpen = signal(true);
  
  // Image specific
  imageStyleOpen = signal(true);
  
  bgType = signal<'none' | 'classic' | 'gradient'>('none');

  styles = signal<'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'>('normal');

  fonts = signal<string[]>([
    'Par défaut',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana'
  ]);
}
