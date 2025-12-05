import { BuilderStateService } from '@admin/services/builder-state-service';
import { DragDropService } from '@admin/services/drag-drop-service';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Block, BlockRendererComponent } from 'page-builder';
import { createBlockFromWidget, WidgetItem } from '../editor-sidebar/widget-list';
import { ColumnSelectorComponent } from '../components/column-selector/column-selector.component';
import { CanvasBlockComponent } from './canvas-block.component';

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

@Component({
  selector: 'app-editor-canvas',
  imports: [CdkDropList, CdkDrag, ColumnSelectorComponent, CanvasBlockComponent],
  template: `
    <div class="editor-canvas">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="toolbar-left">
          <button class="icon-btn" (click)="undo()" [disabled]="!builderState.canUndo()">
            <span class="material-symbols-outlined">undo</span>
          </button>
          <button class="icon-btn" (click)="redo()" [disabled]="!builderState.canRedo()">
            <span class="material-symbols-outlined">redo</span>
          </button>
        </div>

        <div class="device-toggle">
          @for (mode of ['desktop', 'tablet', 'mobile']; track mode) {
            <button 
              class="device-btn"
              [class.active]="viewMode() === mode"
              (click)="setViewMode($any(mode))"
            >
              <span class="material-symbols-outlined">
                {{ mode === 'desktop' ? 'desktop_windows' : mode === 'tablet' ? 'tablet_mac' : 'smartphone' }}
              </span>
            </button>
          }
        </div>

        <button class="save-btn" (click)="saveNow()">Sauvegarder</button>
      </div>

      <!-- Canvas Area -->
      <div class="canvas-area" (click)="builderState.selectBlock(null)">
        <div 
          class="canvas-content"
          [class.desktop]="viewMode() === 'desktop'"
          [class.tablet]="viewMode() === 'tablet'"
          [class.mobile]="viewMode() === 'mobile'"
          cdkDropList
          #rootList="cdkDropList"
          id="root-list"
          [cdkDropListData]="{ type: 'root', children: rootChildren() }"
          [cdkDropListConnectedTo]="builderState.allDropListIds()"
          [cdkDropListEnterPredicate]="canEnter"
          (cdkDropListDropped)="onRootDrop($event)"
        >
          @if (rootChildren().length === 0) {
            <div class="empty-state">
              <span class="material-symbols-outlined">add_circle_outline</span>
              <p>Glissez des widgets ici</p>
            </div>
          }

          @for (block of rootChildren(); track block.id) {
            <app-canvas-block [block]="block" />
          }
        </div>
      </div>

      @if (builderState.pendingGridId()) {
        <app-column-selector 
          (select)="onColumnSelect($event)"
          (cancel)="builderState.pendingGridId.set(null)"
        />
      }
    </div>
  `,
  styles: `
    .editor-canvas {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f3f4f6;
    }
    .toolbar {
      height: 48px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      flex-shrink: 0;
    }
    .toolbar-left {
      display: flex;
      gap: 4px;
    }
    .icon-btn {
      padding: 6px;
      border: none;
      background: none;
      border-radius: 4px;
      cursor: pointer;
      color: #6b7280;
      &:hover { background: #f3f4f6; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
      .material-symbols-outlined { font-size: 20px; }
    }
    .device-toggle {
      display: flex;
      background: #f3f4f6;
      padding: 4px;
      border-radius: 6px;
    }
    .device-btn {
      padding: 6px 8px;
      border: none;
      background: none;
      border-radius: 4px;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
      &.active { background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
      .material-symbols-outlined { font-size: 20px; }
    }
    .save-btn {
      padding: 6px 16px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      &:hover { background: #2563eb; }
    }
    .canvas-area {
      flex: 1;
      overflow: auto;
      padding: 32px;
      display: flex;
      justify-content: center;
    }
    .canvas-content {
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      min-height: calc(100vh - 150px);
      transition: width 0.3s;
      width: 100%;
      max-width: 1200px;
      padding-bottom: 50px; /* Space for dropping at bottom */
    }
    .canvas-content.tablet { 
      width: 768px; 
      max-width: 768px;
    }
    .canvas-content.mobile { 
      width: 375px; 
      max-width: 375px;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      color: #9ca3af;
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      margin: 24px;
      .material-symbols-outlined { font-size: 48px; margin-bottom: 8px; }
    }
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.25);
      background: white;
    }
    .cdk-drag-placeholder {
      opacity: 0.5;
      background: #dbeafe;
      border: 2px dashed #3b82f6;
      border-radius: 4px;
      min-height: 80px;
      flex-shrink: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorCanvasComponent {
  builderState = inject(BuilderStateService);
  dragDropService = inject(DragDropService);

  viewMode = signal<ViewMode>('desktop');

  rootChildren = computed(() => {
    const blocks = this.builderState.blocks();
    const root = blocks.find(b => b.id === 'root');
    return root?.children || [];
  });

  canEnter = (drag: CdkDrag, drop: CdkDropList) => {
    return true;
  };

  setViewMode(mode: ViewMode) {
    this.viewMode.set(mode);
    this.builderState.setDevice(mode);
  }

  undo() { this.builderState.undo(); }
  redo() { this.builderState.redo(); }
  saveNow() { this.builderState.forceSave(); }

  onRootDrop(event: CdkDragDrop<any, any>) {
    console.log('[ROOT DROP]', event);
    this.handleDrop(event, 'root');
  }

  onColumnSelect(template: string) {
    const id = this.builderState.pendingGridId();
    if (id) {
      // Update parent styles to be a grid
      this.builderState.updateBlockStyles(id, 'desktop', {
        display: 'grid',
        gridTemplateColumns: template,
        gap: '16px',
        padding: '10px'
      });

      // Create column blocks
      const colCount = template.split(' ').length;
      const columns: Block[] = Array.from({ length: colCount }).map((_, i) => ({
        id: this.builderState.generateId(),
        type: 'container',
        label: `Colonne ${i + 1}`,
        data: {},
        styles: {
          desktop: {
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            minHeight: '80px',
            height: '100%',
            border: '1px dashed #e5e7eb'
          }
        },
        children: []
      }));

      // Set the columns as children of the grid/container
      this.builderState.updateBlock(id, { children: columns });

      this.builderState.pendingGridId.set(null);
    }
  }

  private handleDrop(event: CdkDragDrop<any, any>, targetId: string) {
    const dragData = event.item.data;
    console.log('handleDrop:', { targetId, dragData, index: event.currentIndex });

    if (this.isWidgetItem(dragData)) {
      const widget = dragData as WidgetItem;
      const newBlock = createBlockFromWidget(widget, this.builderState.generateId());
      console.log('Adding new widget:', newBlock.type, 'to:', targetId);
      this.builderState.addBlock(newBlock, targetId, event.currentIndex);

      // If it's a grid or container, open configuration
      if (newBlock.type === 'grid' || newBlock.type === 'container') {
        this.builderState.pendingGridId.set(newBlock.id);
      }
    } else if (this.isBlock(dragData)) {
      if (event.previousContainer === event.container) {
        if (event.previousIndex !== event.currentIndex) {
          this.builderState.reorderChildren(targetId, event.previousIndex, event.currentIndex);
        }
      } else {
        const block = dragData as Block;
        this.builderState.moveBlockBetweenContainers(block.id, targetId, event.currentIndex);
      }
    }
  }

  private isWidgetItem(data: any): data is WidgetItem {
    return data && 'blockType' in data && 'category' in data;
  }

  private isBlock(data: any): data is Block {
    return data && 'id' in data && 'type' in data && !('blockType' in data);
  }
}
