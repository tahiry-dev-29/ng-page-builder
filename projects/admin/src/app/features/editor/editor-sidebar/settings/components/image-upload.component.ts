import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  template: `
    <div class="mb-4">
      <label class="block text-xs font-medium text-gray-600 mb-2">{{ label() }}</label>
      <div 
        class="bg-gray-200 h-32 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors relative group"
        (click)="fileInput.click()"
      >
        @if (imageUrl()) {
          <img 
            [src]="imageUrl()!" 
            alt="Preview" 
            class="w-full h-full object-cover rounded"
          />
        } @else {
          <span class="material-symbols-outlined text-4xl text-gray-400">image</span>
        }
        
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded flex items-center justify-center">
          <span class="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
        </div>
      </div>
      
      <input 
        #fileInput
        type="file" 
        accept="image/*"
        class="hidden"
        (change)="onFileSelected($event)"
      />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent {
  label = input('Choisir une image');
  imageUrl = input<string | null>(null);
  
  imageChange = output<File>();
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageChange.emit(input.files[0]);
    }
  }
}
