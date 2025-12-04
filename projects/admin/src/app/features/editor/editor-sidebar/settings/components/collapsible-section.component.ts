import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';

@Component({
  selector: 'app-collapsible-section',
  standalone: true,
  template: `
    <div class="mb-4">
      <div 
        class="flex items-center justify-between cursor-pointer py-2 hover:bg-gray-50 rounded px-2 -mx-2"
        (click)="isOpen.set(!isOpen())"
      >
        <div class="flex items-center gap-2">
          <span 
            class="material-symbols-outlined text-sm transition-transform"
            [class.rotate-90]="isOpen()"
          >
            chevron_right
          </span>
          @if (icon()) {
            <span class="material-symbols-outlined text-sm text-gray-600">{{ icon() }}</span>
          }
          <h4 class="text-xs font-semibold text-gray-700">{{ title() }}</h4>
          @if (isPro()) {
            <span class="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded">PRO</span>
          }
        </div>
      </div>
      
      @if (isOpen()) {
        <div class="mt-2 pl-6">
          <ng-content />
        </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollapsibleSectionComponent {
  title = input.required<string>();
  icon = input<string>();
  isPro = input(false);
  defaultOpen = input(false);
  
  isOpen = signal(this.defaultOpen());
}
