import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-image-picker',
  standalone: true,
  template: `
    <div class="mb-4">
      <label class="block text-xs font-medium text-gray-600 mb-2">{{ label() }}</label>
      <div class="bg-gray-200 h-32 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors relative group">
        <span class="material-symbols-outlined text-4xl text-gray-400">image</span>
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded flex items-center justify-center">
          <span class="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagePickerComponent {
  label = input.required<string>();
}
