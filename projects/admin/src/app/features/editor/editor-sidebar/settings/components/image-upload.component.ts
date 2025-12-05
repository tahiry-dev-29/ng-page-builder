import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  template: `
    <div class="mb-4">
      <label class="block text-xs font-medium text-gray-600 mb-2">{{ label() }}</label>
      
      <!-- Preview area -->
      <div 
        class="bg-gray-100 min-h-32 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors relative group border-2 border-dashed border-gray-300 hover:border-blue-400"
        (click)="fileInput.click()"
      >
        @if (hasImage()) {
          <img 
            [src]="currentUrl()" 
            alt="Preview" 
            class="max-w-full max-h-48 object-contain rounded"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
          </div>
        } @else {
          <span class="material-symbols-outlined text-4xl text-gray-400 mb-2">add_photo_alternate</span>
          <span class="text-xs text-gray-500">Cliquez pour téléverser</span>
        }
      </div>
      
      <!-- Hidden file input -->
      <input 
        #fileInput
        type="file" 
        accept="image/*"
        class="hidden"
        (change)="onFileSelected($event)"
      />
      
      <!-- Upload button -->
      <button
        type="button"
        class="mt-2 w-full py-2 px-4 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        (click)="fileInput.click()"
      >
        <span class="material-symbols-outlined text-sm">upload</span>
        Téléverser une image
      </button>
      
      @if (uploadStatus()) {
        <p class="mt-1 text-xs text-green-600">{{ uploadStatus() }}</p>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent {
  label = input('Choisir une image');
  imageUrl = input<string | null>(null);
  
  imageChange = output<File>();
  
  uploadStatus = signal<string>('');
  
  hasImage() {
    const url = this.imageUrl();
    return url && url.length > 0;
  }
  
  currentUrl() {
    return this.imageUrl() || '';
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadStatus.set(`Image sélectionnée: ${file.name}`);
      this.imageChange.emit(file);
      
      // Reset input so same file can be selected again
      input.value = '';
    }
  }
}
