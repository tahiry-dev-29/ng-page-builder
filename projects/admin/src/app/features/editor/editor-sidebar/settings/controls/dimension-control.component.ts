import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dimension-control',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <label class="text-xs font-medium text-gray-600">{{ label() }}</label>
        <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-gray-400 text-sm">desktop_windows</span>
            <span class="text-xs text-gray-400">px</span>
            <span class="material-symbols-outlined text-gray-400 text-xs cursor-pointer">expand_more</span>
        </div>
      </div>
      <div class="flex gap-1">
        <div class="flex-1">
            <input type="number" class="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center focus:border-blue-500 outline-none" placeholder="">
            <div class="text-[10px] text-gray-400 text-center mt-1">Haut</div>
        </div>
        <div class="flex-1">
            <input type="number" class="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center focus:border-blue-500 outline-none" placeholder="">
            <div class="text-[10px] text-gray-400 text-center mt-1">Droite</div>
        </div>
        <div class="flex-1">
            <input type="number" class="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center focus:border-blue-500 outline-none" placeholder="">
            <div class="text-[10px] text-gray-400 text-center mt-1">Bas</div>
        </div>
        <div class="flex-1">
            <input type="number" class="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center focus:border-blue-500 outline-none" placeholder="">
            <div class="text-[10px] text-gray-400 text-center mt-1">Gauche</div>
        </div>
        <div class="flex items-start pt-1">
            <button class="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors" (click)="linked.set(!linked())">
                <span class="material-symbols-outlined text-sm text-gray-600">{{ linked() ? 'link' : 'link_off' }}</span>
            </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionControlComponent {
  label = input.required<string>();
  linked = signal(true);
}
