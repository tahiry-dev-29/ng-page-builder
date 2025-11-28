import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-slider-control',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <label class="text-xs font-medium text-gray-600">{{ label() }}</label>
         <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-gray-400 text-sm">desktop_windows</span>
            <div class="flex items-center">
                <span class="text-xs text-gray-400 mr-1">{{ unit() }}</span>
                <span class="material-symbols-outlined text-gray-400 text-xs cursor-pointer">expand_more</span>
            </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <input 
            type="range" 
            [min]="min()" 
            [max]="max()" 
            [value]="value()"
            (input)="updateValue($any($event.target).value)"
            class="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        >
        <input 
            type="number" 
            [value]="value()"
            (input)="updateValue($any($event.target).value)"
            class="w-16 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:border-blue-500 outline-none"
        >
      </div>
    </div>
  `,
  styles: `
    /* Custom slider styling could go here if needed beyond Tailwind */
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderControlComponent {
  label = input.required<string>();
  min = input(0);
  max = input(100);
  unit = input('px');
  
  value = signal(0);

  updateValue(val: string | number) {
    this.value.set(Number(val));
  }
}
