import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-icon-picker',
  standalone: true,
  template: `
    <div class="mb-4">
      <label class="block text-xs font-medium text-gray-600 mb-2">{{ label() }}</label>
      <div class="flex items-center gap-2">
        <div class="flex-1 flex items-center justify-end gap-1">
          @for (icon of icons(); track icon) {
            <button class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              <span class="material-symbols-outlined text-sm">{{ icon }}</span>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconPickerComponent {
  label = input.required<string>();
  icons = input<string[]>(['block', 'upload', 'circle']);
}
