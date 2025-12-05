import { Injectable, signal, effect, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Block, ResponsiveStyles, BlockStyles } from 'page-builder';

const STORAGE_KEY = 'elementor_page_data';
const DEBOUNCE_MS = 1000;

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

// Helper to create default responsive styles
function createDefaultStyles(overrides?: Partial<BlockStyles>): ResponsiveStyles {
  return { desktop: { ...overrides } };
}

@Injectable({
  providedIn: 'root'
})
export class BuilderStateService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private saveTimeout: any = null;

  // Page blocks tree
  blocks = signal<Block[]>(this.loadFromStorage());
  
  // Selection
  selectedBlockId = signal<string | null>(null);
  
  // Device preview
  activeDevice = signal<DeviceType>('desktop');
  
  // Pending Grid Configuration
  pendingGridId = signal<string | null>(null);
  
  // Undo/Redo
  private history = signal<Block[][]>([]);
  private historyIndex = signal(-1);

  // Computed
  selectedBlock = computed(() => {
    const id = this.selectedBlockId();
    if (!id) return null;
    return this.findBlockById(this.blocks(), id);
  });

  canUndo = computed(() => this.historyIndex() > 0);
  canRedo = computed(() => this.historyIndex() < this.history().length - 1);

  // Track all drop list IDs for drag and drop connections
  allDropListIds = computed(() => {
    const ids = ['root-list'];
    const traverse = (blocks: Block[]) => {
      for (const block of blocks) {
        if (block.type === 'container' || block.type === 'grid') {
          ids.push(`container-${block.id}`);
        }
        if (block.children) {
          traverse(block.children);
        }
      }
    };
    traverse(this.blocks());
    return ids;
  });

  constructor() {
    // Debounced auto-save
    if (this.isBrowser) {
      effect(() => {
        const currentBlocks = this.blocks();
        this.debouncedSave(currentBlocks);
      });
    }
  }

  private debouncedSave(blocks: Block[]): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveToStorage(blocks);
    }, DEBOUNCE_MS);
  }

  private loadFromStorage(): Block[] {
    if (!this.isBrowser) return this.getDefaultBlocks();
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Block[];
        // Migrate old format if needed
        return this.migrateBlocks(parsed);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return this.getDefaultBlocks();
  }

  // Migrate old blocks to new responsive format
  private migrateBlocks(blocks: Block[]): Block[] {
    return blocks.map(block => this.migrateBlock(block));
  }

  private migrateBlock(block: Block): Block {
    // Check if already in new format
    if (block.styles && 'desktop' in block.styles) {
      return {
        ...block,
        children: block.children?.map(c => this.migrateBlock(c))
      };
    }
    
    // Migrate from old format
    return {
      ...block,
      styles: createDefaultStyles(block.styles as any),
      children: block.children?.map(c => this.migrateBlock(c))
    };
  }

  private saveToStorage(blocks: Block[]): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getDefaultBlocks(): Block[] {
    return [
      {
        id: 'root',
        type: 'container',
        label: 'Page',
        data: {},
        styles: createDefaultStyles({
          minHeight: '100vh',
          padding: '20px',
          backgroundColor: '#ffffff'
        }),
        children: []
      }
    ];
  }

  private findBlockById(blocks: Block[], id: string): Block | null {
    for (const block of blocks) {
      if (block.id === id) return block;
      if (block.children) {
        const found = this.findBlockById(block.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  private updateBlockInTree(blocks: Block[], id: string, updates: Partial<Block>): Block[] {
    return blocks.map(block => {
      if (block.id === id) {
        return { ...block, ...updates };
      }
      if (block.children) {
        return { ...block, children: this.updateBlockInTree(block.children, id, updates) };
      }
      return block;
    });
  }

  private deleteBlockFromTree(blocks: Block[], id: string): Block[] {
    return blocks
      .filter(block => block.id !== id)
      .map(block => {
        if (block.children) {
          return { ...block, children: this.deleteBlockFromTree(block.children, id) };
        }
        return block;
      });
  }

  private saveHistory(): void {
    const current = JSON.parse(JSON.stringify(this.blocks()));
    const newHistory = this.history().slice(0, this.historyIndex() + 1);
    newHistory.push(current);
    if (newHistory.length > 50) newHistory.shift();
    this.history.set(newHistory);
    this.historyIndex.set(newHistory.length - 1);
  }

  generateId(): string {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add block to parent
  addBlock(block: Block, parentId: string = 'root', index?: number) {
    this.saveHistory();
    this.blocks.update(blocks => this.addBlockToParent(blocks, block, parentId, index));
  }

  private addBlockToParent(blocks: Block[], newBlock: Block, parentId: string, index?: number): Block[] {
    return blocks.map(block => {
      if (block.id === parentId) {
        const children = [...(block.children || [])];
        if (index !== undefined && index >= 0) {
          children.splice(index, 0, newBlock);
        } else {
          children.push(newBlock);
        }
        return { ...block, children };
      }
      if (block.children) {
        return { ...block, children: this.addBlockToParent(block.children, newBlock, parentId, index) };
      }
      return block;
    });
  }

  moveBlock(blockId: string, newParentId: string, newIndex: number): void {
    const block = this.findBlockById(this.blocks(), blockId);
    if (!block) return;
    
    this.saveHistory();
    this.blocks.update(blocks => this.deleteBlockFromTree(blocks, blockId));
    this.blocks.update(blocks => this.addBlockToParent(blocks, block, newParentId, newIndex));
  }

  // Reorder children within a parent
  reorderChildren(parentId: string, previousIndex: number, currentIndex: number): void {
    const parent = this.findBlockById(this.blocks(), parentId);
    if (!parent?.children) return;

    this.saveHistory();
    const newChildren = [...parent.children];
    const [moved] = newChildren.splice(previousIndex, 1);
    newChildren.splice(currentIndex, 0, moved);
    this.blocks.update(blocks => this.updateBlockInTree(blocks, parentId, { children: newChildren }));
  }

  // Force immediate save
  forceSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveToStorage(this.blocks());
    console.log('Page saved!');
  }

  // Move block from one container to another
  moveBlockBetweenContainers(blockId: string, newParentId: string, newIndex: number): void {
    const block = this.findBlockById(this.blocks(), blockId);
    if (!block) return;

    this.saveHistory();
    // First remove from old location
    this.blocks.update(blocks => this.deleteBlockFromTree(blocks, blockId));
    // Then add to new location
    this.blocks.update(blocks => this.addBlockToParent(blocks, block, newParentId, newIndex));
  }

  updateBlock(id: string, updates: Partial<Block>) {
    this.saveHistory();
    this.blocks.update(blocks => this.updateBlockInTree(blocks, id, updates));
  }

  // Update styles for specific device
  updateBlockStyles(id: string, device: DeviceType, styles: Partial<BlockStyles>) {
    const block = this.findBlockById(this.blocks(), id);
    if (!block) return;

    const newStyles: ResponsiveStyles = { ...block.styles };
    newStyles[device] = { ...(newStyles[device] || {}), ...styles };
    
    this.updateBlock(id, { styles: newStyles });
  }

  // Update hover styles
  updateBlockHoverStyles(id: string, styles: Partial<BlockStyles>) {
    const block = this.findBlockById(this.blocks(), id);
    if (!block) return;

    const newStyles: ResponsiveStyles = { ...block.styles };
    newStyles['hover'] = { ...(newStyles['hover'] || {}), ...styles };
    
    this.updateBlock(id, { styles: newStyles });
  }

  deleteBlock(id: string) {
    this.saveHistory();
    this.blocks.update(blocks => this.deleteBlockFromTree(blocks, id));
    if (this.selectedBlockId() === id) {
      this.selectedBlockId.set(null);
    }
  }

  duplicateBlock(id: string): void {
    const block = this.findBlockById(this.blocks(), id);
    if (!block) return;
    
    this.saveHistory();
    const duplicated = this.deepCloneWithNewIds(block);
    this.blocks.update(blocks => this.insertAfterBlock(blocks, id, duplicated));
  }

  private deepCloneWithNewIds(block: Block): Block {
    return {
      ...block,
      id: this.generateId(),
      children: block.children?.map(child => this.deepCloneWithNewIds(child))
    };
  }

  private insertAfterBlock(blocks: Block[], afterId: string, newBlock: Block): Block[] {
    const result: Block[] = [];
    for (const block of blocks) {
      if (block.children) {
        result.push({ ...block, children: this.insertAfterBlock(block.children, afterId, newBlock) });
      } else {
        result.push(block);
      }
      if (block.id === afterId) {
        result.push(newBlock);
      }
    }
    return result;
  }

  selectBlock(id: string | null) {
    this.selectedBlockId.set(id);
  }

  getSelectedBlock() {
    return this.selectedBlock();
  }

  setDevice(device: DeviceType) {
    this.activeDevice.set(device);
  }

  undo(): void {
    if (this.historyIndex() > 0) {
      this.historyIndex.update(i => i - 1);
      this.blocks.set(JSON.parse(JSON.stringify(this.history()[this.historyIndex()])));
    }
  }

  redo(): void {
    if (this.historyIndex() < this.history().length - 1) {
      this.historyIndex.update(i => i + 1);
      this.blocks.set(JSON.parse(JSON.stringify(this.history()[this.historyIndex()])));
    }
  }

  clearBlocks() {
    this.saveHistory();
    this.blocks.set(this.getDefaultBlocks());
    this.selectedBlockId.set(null);
  }

  exportBlocks(): string {
    return JSON.stringify(this.blocks(), null, 2);
  }

  importBlocks(json: string): boolean {
    try {
      const parsed = JSON.parse(json) as Block[];
      this.saveHistory();
      this.blocks.set(this.migrateBlocks(parsed));
      return true;
    } catch {
      return false;
    }
  }
}
