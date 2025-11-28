import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { BlockRendererComponent, Block } from 'page-builder';

@Component({
  selector: 'app-page-viewer',
  standalone: true,
  imports: [BlockRendererComponent],
  template: `
    <div class="page-viewer">
      @for (block of blocks(); track block.id) {
        <pb-block-renderer [block]="block" />
      }
    </div>
  `,
  styles: `
    .page-viewer {
      width: 100%;
      min-height: 100vh;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageViewerComponent {
  // TODO: Load blocks from page-data-resource
  blocks = signal<Block[]>([
    {
      id: '1',
      type: 'container',
      styles: {
        padding: '20px',
        backgroundColor: '#f5f5f5'
      },
      children: [
        {
          id: '2',
          type: 'text',
          content: {
            text: '<h1>Welcome to Public Site</h1><p>This page is rendered using the page-builder library!</p>'
          },
          styles: {
            color: '#333'
          }
        }
      ]
    }
  ]);
}
