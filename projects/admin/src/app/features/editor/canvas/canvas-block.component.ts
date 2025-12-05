import { Component, computed, inject, input, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { Block, BlockRendererComponent } from 'page-builder';
import { BuilderStateService } from '@admin/services/builder-state-service';
import { DragDropService } from '@admin/services/drag-drop-service';
import { WidgetItem, createBlockFromWidget } from '../editor-sidebar/widget-list';

@Component({
  selector: 'app-canvas-block',
  imports: [CdkDropList, CdkDrag, CdkDragHandle, BlockRendererComponent],
  template: `
    <div 
      class="block-wrapper"
      [class.selected]="isSelected()"
      [class.container-wrapper]="isContainer()"
      [class.is-child]="isChild()"
      (click)="selectBlock($event)"
      (mouseenter)="isHovered.set(true)"
      (mouseleave)="isHovered.set(false)"
      cdkDrag
      [cdkDragData]="block()"
      [cdkDragDisabled]="block().id === 'root'"
    >
      <!-- Handle & Actions (Only show for non-root) -->
      @if (block().id !== 'root') {
        <div class="block-ui-controls" [class.visible]="isSelected() || isHovered()">
          <div class="block-handle" cdkDragHandle>
            <span class="material-symbols-outlined">drag_indicator</span>
          </div>
          
          <div class="block-label">
            {{ block().label }}
          </div>

          <div class="block-actions">
            <button class="action-btn" (click)="duplicateBlock($event)" title="Dupliquer">
              <span class="material-symbols-outlined">content_copy</span>
            </button>
            <button class="action-btn delete" (click)="deleteBlock($event)" title="Supprimer">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      }

      <!-- Content -->
      @if (isContainer()) {
        <div 
          class="container-drop-zone"
          [style]="containerStyles()"
          cdkDropList
          [id]="'container-' + block().id"
          [cdkDropListData]="{ type: 'container', id: block().id, children: block().children || [] }"
          [cdkDropListConnectedTo]="builderState.allDropListIds()"
          [cdkDropListEnterPredicate]="canEnter"
          (cdkDropListDropped)="onDrop($event)"
        >
          @if (!block().children?.length) {
            <div class="empty-state-small">
              <span class="material-symbols-outlined">add</span>
            </div>
          }

          @for (child of block().children; track child.id) {
            <app-canvas-block 
              [block]="child" 
              [isChild]="true"
            />
          }
        </div>
      } @else {
        <pb-block-renderer [block]="block()" [device]="viewMode()" />
      }
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }

    .block-wrapper {
      position: relative;
      transition: all 0.2s;
    }

    /* Selection & Hover States */
    .block-wrapper:hover {
      outline: 1px solid #3b82f6;
      z-index: 10;
    }

    .block-wrapper.selected {
      outline: 2px solid #3b82f6;
      z-index: 20;
    }

    /* UI Controls (Handle, Label, Actions) */
    .block-ui-controls {
      position: absolute;
      top: -28px; /* Position above the block */
      left: 0;
      display: flex;
      align-items: center;
      background: #3b82f6;
      border-radius: 4px 4px 0 0;
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none; /* Pass through clicks when hidden */
      z-index: 100;
      height: 28px;
      padding: 0 4px;
    }

    .block-ui-controls.visible {
      opacity: 1;
      pointer-events: auto;
    }

    .block-handle {
      cursor: grab;
      display: flex;
      align-items: center;
      padding: 0 4px;
      color: white;
    }

    .block-label {
      font-size: 11px;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
      padding: 0 8px;
      border-right: 1px solid rgba(255,255,255,0.2);
      white-space: nowrap;
    }

    .block-actions {
      display: flex;
      gap: 2px;
      padding-left: 4px;
    }

    .action-btn {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: white;
      cursor: pointer;
      border-radius: 2px;
    }

    .action-btn:hover {
      background: rgba(255,255,255,0.2);
    }

    .action-btn.delete:hover {
      background: #ef4444;
    }

    .action-btn .material-symbols-outlined {
      font-size: 14px;
    }

    /* Container Drop Zone */
    .container-drop-zone {
      min-height: 50px;
      height: 100%; /* Ensure it fills the parent */
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px dashed transparent;
      border-radius: 6px;
    }

    .container-drop-zone:hover {
      background: rgba(59, 130, 246, 0.05);
      border-color: #93c5fd;
      transform: scale(1.005);
    }

    .container-drop-zone.cdk-drop-list-dragging {
      background: rgba(59, 130, 246, 0.08);
      border-color: #3b82f6;
      box-shadow: inset 0 0 0 1px #3b82f6;
    }

    .container-drop-zone.cdk-drop-list-receiving {
      background: rgba(16, 185, 129, 0.1);
      border-color: #10b981;
      box-shadow: inset 0 0 0 1px #10b981;
    }

    .empty-state-small {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 40px;
      color: #cbd5e1;
    }

    /* Drag Preview */
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.25);
      background: white;
      opacity: 0.9;
    }

    .cdk-drag-placeholder {
      opacity: 0.3;
      background: #eff6ff;
      border: 2px dashed #3b82f6;
    }
  `
})
export class CanvasBlockComponent {
  block = input.required<Block>();
  isChild = input(false);

  builderState = inject(BuilderStateService);
  dragDropService = inject(DragDropService);

  isHovered = signal(false);

  viewMode = computed(() => this.builderState.activeDevice());
  isSelected = computed(() => this.builderState.selectedBlockId() === this.block().id);
  isContainer = computed(() => this.block().type === 'container' || this.block().type === 'grid');

  containerStyles = computed(() => {
    const styles = this.block().styles?.[this.viewMode()] || {};
    return {
      display: styles.display || 'flex',
      flexDirection: styles.flexDirection || 'column',
      padding: styles.padding || '0',
      minHeight: styles.minHeight || 'auto',
      backgroundColor: styles.backgroundColor || 'transparent',
      gap: styles.gap || '0',
      gridTemplateColumns: styles.gridTemplateColumns || '',
      height: styles.height || 'auto',
      border: styles.border || 'none'
    };
  });

  canEnter = (drag: CdkDrag, drop: CdkDropList) => {
    console.log('CanvasBlock canEnter:', { 
      dragData: drag.data, 
      dropId: drop.id,
      dropData: drop.data 
    });
    
    // Prevent dropping a parent into its own child
    const dragData = drag.data as Block;
    const dropData = drop.data;
    
    if (this.isBlock(dragData) && dropData.type === 'container') {
       if (dragData.id === dropData.id) return false;
       // Also check if dropData.id is a child of dragData (recursive check needed if we want to be 100% safe)
    }
    return true;
  };

  selectBlock(event: Event) {
    event.stopPropagation();
    this.builderState.selectBlock(this.block().id);
  }

  deleteBlock(event: Event) {
    event.stopPropagation();
    this.builderState.deleteBlock(this.block().id);
  }

  duplicateBlock(event: Event) {
    event.stopPropagation();
    this.builderState.duplicateBlock(this.block().id);
  }

  onDrop(event: CdkDragDrop<any, any>) {
    event.event.stopPropagation(); // Stop bubbling to parent containers
    
    const targetId = this.block().id;
    const dragData = event.item.data;

    console.log('Drop on', targetId, dragData);

    if (this.isWidgetItem(dragData)) {
      const widget = dragData as WidgetItem;
      const newBlock = createBlockFromWidget(widget, this.builderState.generateId());
      this.builderState.addBlock(newBlock, targetId, event.currentIndex);
      
      // Auto-open column selector for grids
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
