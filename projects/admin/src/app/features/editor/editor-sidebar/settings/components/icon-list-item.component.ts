import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-icon-list-item',
  template: `
    <div class="border border-gray-200 rounded bg-white">
      <div class="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">{{ icon() }}</span>
          <span class="text-xs font-medium">{{ text() }}</span>
        </div>
        <div class="flex items-center gap-1">
          <button 
            class="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
            (click)="duplicate.emit(index())"
            type="button"
          >
            <span class="material-symbols-outlined text-sm">content_copy</span>
          </button>
          <button 
            class="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
            (click)="remove.emit(index())"
            type="button"
          >
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconListItemComponent {
  icon = input.required<string>();
  text = input.required<string>();
  index = input.required<number>();
  
  duplicate = output<number>();
  remove = output<number>();
}
