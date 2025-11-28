import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { BlockRendererComponent } from 'page-builder';
import { BuilderStateService } from '../../../services/builder-state-service';

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

@Component({
  selector: 'app-editor-canvas',
  standalone: true,
  imports: [BlockRendererComponent, TitleCasePipe],
  template: `
    <div class="canvas-toolbar">
      <div class="view-controls">
        <button 
          [class.active]="viewMode() === 'desktop'"
          (click)="viewMode.set('desktop')"
          title="Desktop"
        >
          <span class="material-symbols-outlined">desktop_windows</span>
        </button>
        <button 
          [class.active]="viewMode() === 'tablet'"
          (click)="viewMode.set('tablet')"
          title="Tablet"
        >
          <span class="material-symbols-outlined">tablet_mac</span>
        </button>
        <button 
          [class.active]="viewMode() === 'mobile'"
          (click)="viewMode.set('mobile')"
          title="Mobile"
        >
          <span class="material-symbols-outlined">smartphone</span>
        </button>
      </div>
      <div class="zoom-controls">
        <span class="text-xs text-gray-500">{{ viewMode() | titlecase }}</span>
      </div>
    </div>

    <div class="canvas-container">
      <div 
        class="canvas-content"
        [class.w-full]="viewMode() === 'desktop'"
        [class.tablet-view]="viewMode() === 'tablet'"
        [class.mobile-view]="viewMode() === 'mobile'"
      >
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
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      overflow: hidden;
    }

    .canvas-toolbar {
      height: 40px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      flex-shrink: 0;
    }

    .view-controls {
      display: flex;
      gap: 8px;
      background: #f3f4f6;
      padding: 4px;
      border-radius: 6px;
    }

    .view-controls button {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      color: #6b7280;
      transition: all 0.2s;
    }

    .view-controls button:hover {
      background: rgba(0,0,0,0.05);
      color: #374151;
    }

    .view-controls button.active {
      background: white;
      color: #2563eb;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .view-controls .material-symbols-outlined {
      font-size: 18px;
    }

    .canvas-container {
      flex: 1;
      overflow: auto;
      background: #e5e7eb;
      padding: 40px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .canvas-content {
      background: white;
      min-height: calc(100vh - 120px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: width 0.3s ease;
    }

    .canvas-content.w-full {
      width: 100%;
      max-width: 1200px;
    }

    .canvas-content.tablet-view {
      width: 768px;
    }

    .canvas-content.mobile-view {
      width: 375px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: #9ca3af;
    }

    .empty-state .material-symbols-outlined {
      font-size: 64px;
      margin-bottom: 16px;
      color: #d1d5db;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorCanvasComponent {
  viewMode = signal<ViewMode>('desktop');

  constructor(public builderState: BuilderStateService) {}
}
