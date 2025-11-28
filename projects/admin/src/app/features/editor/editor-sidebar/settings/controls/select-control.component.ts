import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-control',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mb-4">
      <label class="block text-xs font-medium text-gray-600 mb-2">{{ label() }}</label>
      <div class="relative">
        <select class="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-xs h-8">
          @if (options().length > 0) {
            @for (option of options(); track option) {
              <option>{{ option }}</option>
            }
          } @else {
            <ng-content></ng-content>
          }
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <span class="material-symbols-outlined text-sm">arrow_drop_down</span>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectControlComponent {
  label = input.required<string>();
  options = input<string[]>([]);
  
  // If options array is provided, use it. Otherwise use ng-content for custom options
  hasOptions() {
    return this.options().length > 0;
  }
}
