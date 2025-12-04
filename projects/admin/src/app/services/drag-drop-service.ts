import { Injectable, signal, computed } from '@angular/core';
import { WidgetItem } from '../features/editor/editor-sidebar/widget-list';

export interface DragData {
  type: 'widget' | 'block';
  widget?: WidgetItem;
  blockId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  // Current drag state
  private dragData = signal<DragData | null>(null);
  private dropTargetId = signal<string | null>(null);
  private dropPosition = signal<'before' | 'after' | 'inside' | null>(null);

  // Public computed signals
  isDragging = computed(() => this.dragData() !== null);
  currentDragData = computed(() => this.dragData());
  currentDropTarget = computed(() => this.dropTargetId());
  currentDropPosition = computed(() => this.dropPosition());

  // Start dragging a widget from sidebar
  startWidgetDrag(widget: WidgetItem): void {
    this.dragData.set({ type: 'widget', widget });
  }

  // Start dragging an existing block
  startBlockDrag(blockId: string): void {
    this.dragData.set({ type: 'block', blockId });
  }

  // Update drop target
  setDropTarget(targetId: string | null, position: 'before' | 'after' | 'inside' | null): void {
    this.dropTargetId.set(targetId);
    this.dropPosition.set(position);
  }

  // End drag operation
  endDrag(): void {
    this.dragData.set(null);
    this.dropTargetId.set(null);
    this.dropPosition.set(null);
  }

  // Get current drag info for drop handling
  getDragInfo(): { data: DragData | null; targetId: string | null; position: 'before' | 'after' | 'inside' | null } {
    return {
      data: this.dragData(),
      targetId: this.dropTargetId(),
      position: this.dropPosition()
    };
  }
}
