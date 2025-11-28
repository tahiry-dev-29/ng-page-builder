import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPickerControlComponent } from './color-picker-control.component';
import { SliderControlComponent } from './slider-control.component';

@Component({
  selector: 'app-border-control',
  standalone: true,
  imports: [FormsModule, ColorPickerControlComponent, SliderControlComponent],
  template: `
    <div class="mb-4">
      <label class="block text-xs font-medium text-gray-600 mb-2">Bordure</label>
      
      <!-- Border Type -->
      <div class="mb-3">
        <div class="flex gap-1 mb-2">
          <button 
            class="flex-1 p-2 border rounded text-xs transition-colors"
            [class.border-blue-500]="borderType() === 'none'"
            [class.bg-blue-50]="borderType() === 'none'"
            [class.border-gray-300]="borderType() !== 'none'"
            (click)="borderType.set('none')"
          >
            Aucune
          </button>
          <button 
            class="flex-1 p-2 border rounded text-xs transition-colors"
            [class.border-blue-500]="borderType() === 'solid'"
            [class.bg-blue-50]="borderType() === 'solid'"
            [class.border-gray-300]="borderType() !== 'solid'"
            (click)="borderType.set('solid')"
          >
            Solide
          </button>
          <button 
            class="flex-1 p-2 border rounded text-xs transition-colors"
            [class.border-blue-500]="borderType() === 'dashed'"
            [class.bg-blue-50]="borderType() === 'dashed'"
            [class.border-gray-300]="borderType() !== 'dashed'"
            (click)="borderType.set('dashed')"
          >
            Tirets
          </button>
          <button 
            class="flex-1 p-2 border rounded text-xs transition-colors"
            [class.border-blue-500]="borderType() === 'dotted'"
            [class.bg-blue-50]="borderType() === 'dotted'"
            [class.border-gray-300]="borderType() !== 'dotted'"
            (click)="borderType.set('dotted')"
          >
            Points
          </button>
        </div>
      </div>

      @if (borderType() !== 'none') {
        <!-- Border Width -->
        <app-slider-control label="Largeur" [min]="0" [max]="20" unit="px" />

        <!-- Border Color -->
        <app-color-picker-control label="Couleur" />

        <!-- Border Radius -->
        <div class="mb-3">
          <div class="flex justify-between items-center mb-2">
            <label class="text-xs font-medium text-gray-600">Rayon de bordure</label>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-gray-400 text-sm">desktop_windows</span>
              <span class="text-xs text-gray-400">px</span>
              <span class="material-symbols-outlined text-gray-400 text-xs cursor-pointer">expand_more</span>
            </div>
          </div>
          <div class="flex gap-1">
            <div class="flex-1">
              <input type="number" class="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center focus:border-blue-500 outline-none" placeholder="">
              <div class="text-[10px] text-gray-400 text-center mt-1">Haut G</div>
            </div>
            <div class="flex-1">
              <input type="number" class="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center focus:border-blue-500 outline-none" placeholder="">
              <div class="text-[10px] text-gray-400 text-center mt-1">Haut D</div>
            </div>
            <div class="flex-1">
              <input type="number" class="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center focus:border-blue-500 outline-none" placeholder="">
              <div class="text-[10px] text-gray-400 text-center mt-1">Bas D</div>
            </div>
            <div class="flex-1">
              <input type="number" class="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center focus:border-blue-500 outline-none" placeholder="">
              <div class="text-[10px] text-gray-400 text-center mt-1">Bas G</div>
            </div>
            <div class="flex items-start pt-1">
              <button class="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors" (click)="radiusLinked.set(!radiusLinked())">
                <span class="material-symbols-outlined text-sm text-gray-600">{{ radiusLinked() ? 'link' : 'link_off' }}</span>
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
export class BorderControlComponent {
  borderType = signal<'none' | 'solid' | 'dashed' | 'dotted'>('none');
  radiusLinked = signal(true);
}
