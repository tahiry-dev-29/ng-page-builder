import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-picker-control',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mb-4">
      <label class="block text-xs font-medium text-gray-600 mb-2">{{ label() }}</label>
      <div class="flex items-center gap-2">
        <div class="relative">
          <input 
            type="color" 
            [value]="color()"
            (input)="color.set($any($event.target).value)"
            class="w-10 h-8 rounded border border-gray-300 cursor-pointer"
          >
        </div>
        <input 
          type="text" 
          [value]="color()"
          (input)="color.set($any($event.target).value)"
          placeholder="#000000"
          class="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none h-8 font-mono"
        >
        @if (showClear()) {
          <button 
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            (click)="color.set('')"
          >
            <span class="material-symbols-outlined text-sm text-gray-600">close</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerControlComponent {
  label = input.required<string>();
  showClear = input(true);
  color = signal('#000000');
}
