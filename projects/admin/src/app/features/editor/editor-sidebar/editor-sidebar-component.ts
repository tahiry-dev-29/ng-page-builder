import { Component, ChangeDetectionStrategy, signal, computed, inject, effect } from '@angular/core';
import { CdkDrag, CdkDragPlaceholder, CdkDragPreview, CdkDropList } from '@angular/cdk/drag-drop';
import { WIDGETS, WidgetItem, createBlockFromWidget } from './widget-list';
import { SettingsPanelComponent } from './settings/settings-panel.component';
import { BuilderStateService } from '@admin/services/builder-state-service';
import { DragDropService } from '@admin/services/drag-drop-service';

@Component({
  selector: 'app-editor-sidebar',
  imports: [SettingsPanelComponent, CdkDrag, CdkDragPlaceholder, CdkDragPreview, CdkDropList],
  template: `
    @if (showSettings()) {
      <app-settings-panel 
        [widgetType]="selectedBlockType()"
        [widgetLabel]="'Modifier ' + selectedBlockLabel()"
        (back)="deselectBlock()" 
      />
    } @else {
      <aside class="sidebar">
        <!-- Header -->
        <div class="sidebar-header">
          <h2>Éléments</h2>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button 
            [class.active]="activeTab() === 'widgets'"
            (click)="activeTab.set('widgets')"
          >
            Widgets
          </button>
          <button 
            [class.active]="activeTab() === 'globals'"
            (click)="activeTab.set('globals')"
          >
            Globales
          </button>
        </div>

        <!-- Content -->
        @if (activeTab() === 'widgets') {
          <div class="content">
            <!-- Search -->
            <div class="search-box">
              <span class="material-symbols-outlined">search</span>
              <input 
                type="text" 
                placeholder="Rechercher un widget..." 
                (input)="searchQuery.set($any($event.target).value)"
              >
            </div>

            <!-- Layout Category -->
            @if (layoutWidgets().length > 0) {
              <div class="category">
                <div class="category-header" (click)="toggleCategory('layout')">
                  <span class="material-symbols-outlined arrow" [class.collapsed]="!isLayoutOpen()">arrow_drop_down</span>
                  <h3>Mise en page</h3>
                </div>
                
                @if (isLayoutOpen()) {
                  <div 
                    class="widget-grid"
                    cdkDropList
                    [cdkDropListSortingDisabled]="true"
                    [cdkDropListEnterPredicate]="noEnter"
                    [cdkDropListConnectedTo]="builderState.allDropListIds()"
                  >
                    @for (widget of layoutWidgets(); track widget.label) {
                      <div 
                        class="widget-item"
                        cdkDrag
                        [cdkDragData]="widget"
                        (cdkDragStarted)="onDragStart(widget)"
                        (cdkDragEnded)="onDragEnd()"
                      >
                        <div *cdkDragPreview class="drag-preview">
                          <span class="material-symbols-outlined">{{ widget.icon }}</span>
                          <span>{{ widget.label }}</span>
                        </div>
                        <div *cdkDragPlaceholder class="drag-placeholder"></div>
                        <span class="material-symbols-outlined widget-icon">{{ widget.icon }}</span>
                        <span class="widget-label">{{ widget.label }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            }

            <!-- Basic Category -->
            @if (basicWidgets().length > 0) {
              <div class="category">
                <div class="category-header" (click)="toggleCategory('basic')">
                  <span class="material-symbols-outlined arrow" [class.collapsed]="!isBasicOpen()">arrow_drop_down</span>
                  <h3>Basique</h3>
                </div>
                
                @if (isBasicOpen()) {
                  <div 
                    class="widget-grid"
                    cdkDropList
                    [cdkDropListSortingDisabled]="true"
                    [cdkDropListEnterPredicate]="noEnter"
                    [cdkDropListConnectedTo]="builderState.allDropListIds()"
                  >
                    @for (widget of basicWidgets(); track widget.label) {
                      <div 
                        class="widget-item"
                        cdkDrag
                        [cdkDragData]="widget"
                        (cdkDragStarted)="onDragStart(widget)"
                        (cdkDragEnded)="onDragEnd()"
                      >
                        <div *cdkDragPreview class="drag-preview">
                          <span class="material-symbols-outlined">{{ widget.icon }}</span>
                          <span>{{ widget.label }}</span>
                        </div>
                        <div *cdkDragPlaceholder class="drag-placeholder"></div>
                        <span class="material-symbols-outlined widget-icon">{{ widget.icon }}</span>
                        <span class="widget-label">{{ widget.label }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        } @else {
          <div class="empty-globals">
            Aucun élément global
          </div>
        }
      </aside>
    }
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .sidebar {
      width: 320px;
      background: white;
      border-right: 1px solid #e5e7eb;
      height: 100%;
      display: flex;
      flex-direction: column;
      font-family: system-ui, sans-serif;
    }

    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
      text-align: center;

      h2 {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
      }
    }

    .tabs {
      display: flex;
      border-bottom: 1px solid #e5e7eb;

      button {
        flex: 1;
        padding: 12px;
        font-size: 14px;
        font-weight: 500;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.2s;

        &.active {
          color: #111827;
          border-bottom-color: #111827;
        }

        &:hover:not(.active) {
          color: #374151;
        }
      }
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;

      &::-webkit-scrollbar { display: none; }
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .search-box {
      position: relative;
      margin-bottom: 24px;

      .material-symbols-outlined {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #9ca3af;
        font-size: 18px;
      }

      input {
        width: 100%;
        padding: 10px 12px 10px 40px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;

        &:focus { border-color: #3b82f6; }
      }
    }

    .category { margin-bottom: 24px; }

    .category-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      cursor: pointer;
      user-select: none;

      .arrow {
        font-size: 20px;
        margin-right: 4px;
        transition: transform 0.2s;
        &.collapsed { transform: rotate(-90deg); }
      }

      h3 { font-size: 14px; font-weight: 600; margin: 0; }
    }

    .widget-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .widget-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px 8px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: grab;
      transition: all 0.2s;

      &:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        transform: translateY(-2px);
      }

      &:active { cursor: grabbing; }

      .widget-icon {
        font-size: 28px;
        color: #6b7280;
        margin-bottom: 8px;
        transition: color 0.2s;
      }

      .widget-label {
        font-size: 12px;
        color: #4b5563;
        text-align: center;
      }

      &:hover .widget-icon { color: #3b82f6; }
    }

    .drag-preview {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #3b82f6;
      color: white;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      font-size: 14px;
      font-weight: 500;

      .material-symbols-outlined { font-size: 20px; }
    }

    .drag-placeholder {
      background: #e5e7eb;
      border: 2px dashed #9ca3af;
      border-radius: 8px;
      height: 80px;
    }

    .empty-globals {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      font-size: 14px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorSidebarComponent {
  builderState = inject(BuilderStateService);
  private dragDropService = inject(DragDropService);

  activeTab = signal<'widgets' | 'globals'>('widgets');
  searchQuery = signal('');
  isLayoutOpen = signal(true);
  isBasicOpen = signal(true);

  // Show settings when a block is selected
  showSettings = computed(() => this.builderState.selectedBlockId() !== null);
  
  // Get selected block info
  selectedBlockType = computed(() => {
    const block = this.builderState.selectedBlock();
    if (!block) return 'layout';
    return block.type;
  });

  selectedBlockLabel = computed(() => {
    const block = this.builderState.selectedBlock();
    return block?.label || block?.type || 'Block';
  });

  layoutWidgets = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return WIDGETS.filter(w => w.category === 'layout' && w.label.toLowerCase().includes(query));
  });

  basicWidgets = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return WIDGETS.filter(w => w.category === 'basic' && w.label.toLowerCase().includes(query));
  });

  toggleCategory(category: 'layout' | 'basic') {
    if (category === 'layout') {
      this.isLayoutOpen.update(v => !v);
    } else {
      this.isBasicOpen.update(v => !v);
    }
  }

  onDragStart(widget: WidgetItem) {
    this.dragDropService.startWidgetDrag(widget);
  }

  onDragEnd() {
    this.dragDropService.endDrag();
  }

  deselectBlock() {
    this.builderState.selectBlock(null);
  }

  noEnter = () => false;
}
