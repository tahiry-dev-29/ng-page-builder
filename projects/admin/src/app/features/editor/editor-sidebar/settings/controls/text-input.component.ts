import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-text-input',
  standalone: true,
  template: `
    <div class="mb-4">
      <label class="block text-xs font-medium text-gray-600 mb-2">{{ label() }}</label>
      <div class="flex items-center gap-2">
        <input 
          type="text" 
          class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" 
          [placeholder]="placeholder()"
          [value]="value()"
        >
        @if (showDatabaseButton()) {
          <button class="p-2 hover:bg-gray-100 rounded text-gray-500">
            <span class="material-symbols-outlined text-sm">database</span>
          </button>
        }
        @if (showSettingsButton()) {
          <button class="p-2 hover:bg-gray-100 rounded text-gray-500">
            <span class="material-symbols-outlined text-sm">settings</span>
          </button>
        }
      </div>
      @if (helpText()) {
        <p class="text-[10px] text-gray-400 italic mt-2">{{ helpText() }}</p>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextInputComponent {
  label = input.required<string>();
  placeholder = input('');
  value = input('');
  showDatabaseButton = input(false);
  showSettingsButton = input(false);
  helpText = input('');
}
