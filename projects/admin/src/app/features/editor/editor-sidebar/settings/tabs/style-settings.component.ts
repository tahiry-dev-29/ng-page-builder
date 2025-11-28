import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
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
            <option>Par défaut</option>
            <option>Arial</option>
            <option>Helvetica</option>
            <option>Times New Roman</option>
            <option>Georgia</option>
            <option>Verdana</option>
          </app-select-control>

          <app-slider-control label="Taille" [min]="8" [max]="100" unit="px" />

          <app-select-control label="Graisse">
            <option>Normal</option>
            <option>Bold</option>
            <option>100</option>
            <option>200</option>
            <option>300</option>
            <option>400</option>
            <option>500</option>
            <option>600</option>
            <option>700</option>
            <option>800</option>
            <option>900</option>
          </app-select-control>

          <app-slider-control label="Hauteur de ligne" [min]="1" [max]="3" unit="em" />
          <app-slider-control label="Espacement des lettres" [min]="-5" [max]="10" unit="px" />
          
          <app-color-picker-control label="Couleur du texte" />
        }
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StyleSettingsComponent {
  backgroundOpen = signal(true);
  borderOpen = signal(true);
  shadowOpen = signal(false);
  typographyOpen = signal(false);
  
  bgType = signal<'none' | 'classic' | 'gradient'>('none');
}
