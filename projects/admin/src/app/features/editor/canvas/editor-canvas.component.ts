import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BlockRendererComponent } from 'page-builder';
import { BuilderStateService } from '../../../services/builder-state-service';

@Component({
  selector: 'app-editor-canvas',
  standalone: true,
  imports: [BlockRendererComponent],
  template: `
    <div class="canvas-container">
      <div class="canvas-content">
        @for (block of builderState.blocks(); track block.id) {
          <pb-block-renderer [block]="block" />
        }
        
        @if (builderState.blocks().length === 0) {
          <div class="empty-state">
            <span class="material-symbols-outlined">add_box</span>
            <p>Cliquez sur un widget pour commencer</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .canvas-container {
      flex: 1;
      overflow: auto;
      background: #f0f0f0;
      padding: 20px;
    }

    .canvas-content {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      min-height: calc(100vh - 40px);
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: #999;
    }

    .empty-state .material-symbols-outlined {
      font-size: 64px;
      margin-bottom: 16px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorCanvasComponent {
  constructor(public builderState: BuilderStateService) {}
}
