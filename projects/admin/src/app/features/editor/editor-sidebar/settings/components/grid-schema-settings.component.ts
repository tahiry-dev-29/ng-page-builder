import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grid-schema-settings',
  imports: [FormsModule],
  template: `
    <div class="mb-6">
      <h3 class="text-sm font-bold mb-3">Éléments</h3>

      <!-- Schema toggle -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <label class="text-xs font-medium text-gray-600">Schéma de la grille</label>
          <button 
            class="px-3 py-1 text-xs rounded transition-colors"
            [class.bg-purple-100]="enabled()"
            [class.text-purple-600]="enabled()"
            [class.bg-gray-100]="!enabled()"
            [class.text-gray-600]="!enabled()"
            (click)="enabled.set(!enabled())"
            type="button"
          >
            {{ enabled() ? 'Affiché' : 'Masqué' }}
          </button>
        </div>
      </div>

      @if (enabled()) {
        <!-- Columns -->
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
            />
            <input 
              type="number" 
              [value]="columns()"
              (input)="columns.set(+$any($event.target).value)"
              class="w-16 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <!-- Rows -->
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
            />
            <input 
              type="number" 
              [value]="rows()"
              (input)="rows.set(+$any($event.target).value)"
              class="w-16 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <!-- Gaps -->
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
              <input 
                type="number" 
                [value]="columnGap()"
                (input)="updateColumnGap(+$any($event.target).value)"
                class="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center focus:border-blue-500 outline-none" 
                placeholder=""
              />
              <div class="text-[10px] text-gray-400 text-center mt-1">Colonne</div>
            </div>
            <div class="flex-1">
              <input 
                type="number" 
                [value]="rowGap()"
                (input)="updateRowGap(+$any($event.target).value)"
                class="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center focus:border-blue-500 outline-none" 
                placeholder=""
              />
              <div class="text-[10px] text-gray-400 text-center mt-1">Ligne</div>
            </div>
            <div class="flex items-start pt-1">
              <button 
                class="p-1 rounded transition-colors"
                [class.bg-blue-500]="gapsLinked()"
                [class.bg-gray-200]="!gapsLinked()"
                [class.hover:bg-blue-600]="gapsLinked()"
                [class.hover:bg-gray-300]="!gapsLinked()"
                (click)="toggleGapsLink()"
                type="button"
              >
                <span 
                  class="material-symbols-outlined text-sm"
                  [class.text-white]="gapsLinked()"
                  [class.text-gray-600]="!gapsLinked()"
                >
                  {{ gapsLinked() ? 'link' : 'link_off' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridSchemaSettingsComponent {
  enabled = signal(true);
  columns = signal(3);
  rows = signal(2);
  columnGap = signal(0);
  rowGap = signal(0);
  gapsLinked = signal(true);
  
  toggleGapsLink() {
    this.gapsLinked.update(linked => !linked);
    if (this.gapsLinked()) {
      this.rowGap.set(this.columnGap());
    }
  }

  updateColumnGap(value: number) {
    this.columnGap.set(value);
    if (this.gapsLinked()) {
      this.rowGap.set(value);
    }
  }

  updateRowGap(value: number) {
    this.rowGap.set(value);
    if (this.gapsLinked()) {
      this.columnGap.set(value);
    }
  }
}
