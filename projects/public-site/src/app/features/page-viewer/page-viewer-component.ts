import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-page-viewer',
  standalone: true,
  imports: [],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Page Viewer</h2>
      <p>Content for page: {{ slug() }}</p>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageViewerComponent {
    slug = input<string>();
}
