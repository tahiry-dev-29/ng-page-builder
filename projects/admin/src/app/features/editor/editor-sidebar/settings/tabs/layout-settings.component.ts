import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { SelectControlComponent } from '../controls/select-control.component';
import { SliderControlComponent } from '../controls/slider-control.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout-settings',
  standalone: true,
  imports: [SelectControlComponent, SliderControlComponent, FormsModule],
  template: `
    <div class="p-4 overflow-y-auto h-full">
      <!-- Conteneur Section -->
      <div class="mb-6">
        <div class="flex items-center mb-3 cursor-pointer">
          <span class="material-symbols-outlined text-sm mr-2">arrow_drop_down</span>
          <h3 class="text-sm font-bold">Conteneur</h3>
        </div>

        <!-- Mise en page du conteneur -->
        <app-select-control label="Mise en page du conteneur">
          <option>Grille</option>
          <option>Flex</option>
          <option>Block</option>
        </app-select-control>

        <!-- Largeur du contenu -->
        <app-select-control label="Largeur du contenu">
          <option>Encadré</option>
          <option>Pleine largeur</option>
        </app-select-control>

        <!-- Largeur -->
        <app-slider-control label="Largeur" [min]="0" [max]="2000" unit="px" />

        <!-- Hauteur mini -->
        <app-slider-control label="Hauteur mini" [min]="0" [max]="1000" unit="px" />
        
        <p class="text-[10px] text-gray-400 italic mb-4">Pour atteindre la pleine hauteur du conteneur, utilisez 100vh.</p>
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
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSettingsComponent {
  gridSchemaEnabled = signal(true);
  columns = signal(3);
  rows = signal(2);
}
