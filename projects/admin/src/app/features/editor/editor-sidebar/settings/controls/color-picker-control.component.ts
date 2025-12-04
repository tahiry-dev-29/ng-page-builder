import { Component, ChangeDetectionStrategy, input, signal, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-picker-control',
  imports: [FormsModule],
  template: `
    <div class="mb-4">
      <label class="block text-xs font-medium text-gray-600 mb-2">{{ label() }}</label>
      <div class="flex items-center gap-2">
        <div class="relative">
          <input 
            type="color" 
            [value]="currentColor()"
            (input)="onColorChange($any($event.target).value)"
            class="w-10 h-8 rounded border border-gray-300 cursor-pointer"
          >
        </div>
        <input 
          type="text" 
          [value]="currentColor()"
          (input)="onColorChange($any($event.target).value)"
          placeholder="#000000"
          class="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none h-8 font-mono"
        >
        @if (showClear()) {
          <button 
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            (click)="clearColor()"
          >
            <span class="material-symbols-outlined text-sm text-gray-600">close</span>
          </button>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerControlComponent {
  label = input.required<string>();
  value = input<string>('#000000');
  showClear = input(true);
  
  // Output
  valueChange = output<string>();
  
  currentColor = signal('#000000');

  constructor() {
    effect(() => {
      const val = this.value();
      if (val) this.currentColor.set(val);
    }, { allowSignalWrites: true });
  }

  onColorChange(color: string) {
    this.currentColor.set(color);
    this.valueChange.emit(color);
  }
  
  clearColor() {
    this.currentColor.set('');
    this.valueChange.emit('');
  }
}
