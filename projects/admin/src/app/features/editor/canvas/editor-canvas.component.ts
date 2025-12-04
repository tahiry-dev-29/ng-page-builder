import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { CdkDropList, CdkDrag, CdkDragDrop, CdkDragPlaceholder, moveItemInArray } from '@angular/cdk/drag-drop';
import { BlockRendererComponent, Block } from 'page-builder';
import { BuilderStateService } from '@admin/services/builder-state-service';
import { DragDropService } from '@admin/services/drag-drop-service';
import { createBlockFromWidget, WidgetItem } from '../editor-sidebar/widget-list';

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

@Component({
  selector: 'app-editor-canvas',
  imports: [BlockRendererComponent, TitleCasePipe, CdkDropList, CdkDrag, CdkDragPlaceholder],
  template: `
    <div class="canvas-toolbar">
      <div class="toolbar-left">
        <button 
          class="toolbar-btn"
          [disabled]="!builderState.canUndo()"
          (click)="builderState.undo()"
          title="Annuler (Ctrl+Z)"
        >
          <span class="material-symbols-outlined">undo</span>
        </button>
        <button 
          class="toolbar-btn"
          [disabled]="!builderState.canRedo()"
          (click)="builderState.redo()"
          title="Rétablir (Ctrl+Y)"
        >
          <span class="material-symbols-outlined">redo</span>
        </button>
      </div>

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

      <div class="toolbar-right">
        <span class="view-label">{{ viewMode() | titlecase }}</span>
      </div>
    </div>

    <div class="canvas-container">
      <div 
        class="canvas-content"
        [class.desktop]="viewMode() === 'desktop'"
        [class.tablet]="viewMode() === 'tablet'"
        [class.mobile]="viewMode() === 'mobile'"
        cdkDropList
        [cdkDropListData]="rootChildren()"
        (cdkDropListDropped)="onDrop($event)"
        [cdkDropListEnterPredicate]="canEnter"
      >
        @for (block of rootChildren(); track block.id; let i = $index) {
          <div 
            class="block-wrapper"
            cdkDrag
            [cdkDragData]="block"
            [class.selected]="builderState.selectedBlockId() === block.id"
            (click)="selectBlock(block.id, $event)"
          >
            <!-- Drag Handle -->
            <div class="block-handle" cdkDragHandle>
              <span class="material-symbols-outlined">drag_indicator</span>
            </div>
            
            <!-- Block Actions -->
            <div class="block-actions">
              <button (click)="duplicateBlock(block.id, $event)" title="Dupliquer">
                <span class="material-symbols-outlined">content_copy</span>
              </button>
              <button (click)="deleteBlock(block.id, $event)" title="Supprimer" class="delete">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>

            <!-- Block Renderer -->
            <pb-block-renderer [block]="block" [device]="viewMode()" />

            <!-- Drag Placeholder -->
            <div *cdkDragPlaceholder class="block-placeholder"></div>
          </div>
        }
        
        @if (rootChildren().length === 0 || dragDropService.isDragging()) {
          <div 
            class="empty-state"
            [class.active]="dragDropService.isDragging()"
          >
            <span class="material-symbols-outlined">add_box</span>
            <p>{{ dragDropService.isDragging() ? 'Déposez ici' : 'Glissez un widget pour commencer' }}</p>
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
      height: 48px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      flex-shrink: 0;
    }

    .toolbar-left, .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 120px;
    }

    .toolbar-right {
      justify-content: flex-end;
    }

    .toolbar-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      color: #6b7280;
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: #f3f4f6;
        color: #374151;
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .material-symbols-outlined {
        font-size: 20px;
      }
    }

    .view-controls {
      display: flex;
      gap: 4px;
      background: #f3f4f6;
      padding: 4px;
      border-radius: 8px;

      button {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        color: #6b7280;
        background: none;
        border: none;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          color: #374151;
        }

        &.active {
          background: white;
          color: #3b82f6;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .material-symbols-outlined {
          font-size: 20px;
        }
      }
    }

    .view-label {
      font-size: 13px;
      color: #6b7280;
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
      min-height: calc(100vh - 168px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: width 0.3s ease;
      position: relative;

      &.desktop {
        width: 100%;
        max-width: 1200px;
      }

      &.tablet {
        width: 768px;
      }

      &.mobile {
        width: 375px;
      }
    }

    .block-wrapper {
      position: relative;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        outline: 2px solid #93c5fd;
        outline-offset: -2px;
      }

      &.selected {
        outline: 2px solid #3b82f6;
        outline-offset: -2px;
      }

      &:hover .block-handle,
      &:hover .block-actions {
        opacity: 1;
      }
    }

    .block-handle {
      position: absolute;
      top: 0;
      left: -32px;
      width: 28px;
      height: 28px;
      background: #3b82f6;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 10;

      &:active {
        cursor: grabbing;
      }

      .material-symbols-outlined {
        font-size: 18px;
        color: white;
      }
    }

    .block-actions {
      position: absolute;
      top: 0;
      right: -68px;
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 10;

      button {
        width: 28px;
        height: 28px;
        background: #374151;
        border: none;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: #1f2937;
        }

        &.delete:hover {
          background: #ef4444;
        }

        .material-symbols-outlined {
          font-size: 16px;
          color: white;
        }
      }
    }

    .block-placeholder {
      background: #dbeafe;
      border: 2px dashed #3b82f6;
      border-radius: 4px;
      min-height: 60px;
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
      margin: 20px;
      transition: all 0.2s;

      &.active {
        border-color: #3b82f6;
        background: #eff6ff;
        color: #3b82f6;
      }

      .material-symbols-outlined {
        font-size: 48px;
        margin-bottom: 12px;
      }

      p {
        margin: 0;
        font-size: 14px;
      }
    }

    /* CDK Drag styles */
    .cdk-drag-preview {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      background: white;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drop-list-dragging .block-wrapper:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorCanvasComponent {
  builderState = inject(BuilderStateService);
  dragDropService = inject(DragDropService);

  viewMode = signal<ViewMode>('desktop');

  // Get children of root container
  rootChildren = computed(() => {
    const blocks = this.builderState.blocks();
    const root = blocks.find(b => b.id === 'root');
    return root?.children || [];
  });

  canEnter = () => true;

  selectBlock(id: string, event: Event) {
    event.stopPropagation();
    this.builderState.selectBlock(id);
  }

  deleteBlock(id: string, event: Event) {
    event.stopPropagation();
    this.builderState.deleteBlock(id);
  }

  duplicateBlock(id: string, event: Event) {
    event.stopPropagation();
    this.builderState.duplicateBlock(id);
  }

  onDrop(event: CdkDragDrop<Block[], any>) {
    const dragData = event.item.data;
    console.log('Drop event:', { dragData, previousIndex: event.previousIndex, currentIndex: event.currentIndex });
    
    if (this.isWidgetItem(dragData)) {
      // New widget from sidebar
      const widget = dragData as WidgetItem;
      const newBlock = createBlockFromWidget(widget, this.builderState.generateId());
      console.log('Creating new block:', newBlock);
      this.builderState.addBlock(newBlock, 'root', event.currentIndex);
      console.log('Blocks after add:', JSON.stringify(this.builderState.blocks(), null, 2));
    } else if (this.isBlock(dragData)) {
      // Reordering existing block
      if (event.previousIndex !== event.currentIndex) {
        const blocks = this.builderState.blocks();
        const root = blocks.find(b => b.id === 'root');
        if (root?.children) {
          const newChildren = [...root.children];
          moveItemInArray(newChildren, event.previousIndex, event.currentIndex);
          this.builderState.updateBlock('root', { children: newChildren });
        }
      }
    }
  }

  private isWidgetItem(data: any): data is WidgetItem {
    return data && 'blockType' in data && 'category' in data;
  }

  private isBlock(data: any): data is Block {
    return data && 'id' in data && 'type' in data;
  }
}
