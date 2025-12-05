import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EditorSidebarComponent } from '../editor-sidebar/editor-sidebar-component';
import { EditorCanvasComponent } from '../canvas/editor-canvas.component';

@Component({
  selector: 'app-editor-layout',
  imports: [EditorSidebarComponent, EditorCanvasComponent],
  template: `
    <div class="w-full h-full flex">
      <app-editor-sidebar class="w-1/4"/>
      <app-editor-canvas class="w-3/4"/>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorLayoutComponent {}
