import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EditorSidebarComponent } from '../editor-sidebar/editor-sidebar-component';
import { EditorCanvasComponent } from '../canvas/editor-canvas.component';

@Component({
  selector: 'app-editor-layout',
  standalone: true,
  imports: [EditorSidebarComponent, EditorCanvasComponent],
  template: `
    <div class="editor-layout">
      <app-editor-sidebar />
      <app-editor-canvas />
    </div>
  `,
  styles: `
    .editor-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorLayoutComponent {

}
