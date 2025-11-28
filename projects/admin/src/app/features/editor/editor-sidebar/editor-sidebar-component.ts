import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-editor-sidebar',
  standalone: true,
  imports: [],
  template: `
    <aside class="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold">Editor</h2>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Controls will go here -->
      </div>
    </aside>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorSidebarComponent {

}
