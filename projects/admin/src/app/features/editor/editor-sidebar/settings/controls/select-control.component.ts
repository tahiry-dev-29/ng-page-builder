import { Component, ChangeDetectionStrategy, signal, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-control',
  imports: [FormsModule],
  template: `
    <div class="mb-4">
      <label class="block text-xs font-medium text-gray-600 mb-2">{{ label() }}</label>
      <select 
        class="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-blue-500 outline-none bg-white"
        [value]="currentValue()"
        (change)="onChange($any($event.target).value)"
      >
        @for (option of options(); track option) {
          <option [value]="option">{{ option }}</option>
        }
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectControlComponent {
  label = input.required<string>();
  options = input<string[]>([]);
  value = input<string>('');
  
  valueChange = output<string>();
  
  currentValue = signal('');

  constructor() {
    effect(() => {
      const val = this.value();
      if (val) this.currentValue.set(val);
    }, { allowSignalWrites: true });
  }

  onChange(val: string) {
    this.currentValue.set(val);
    this.valueChange.emit(val);
  }
}
