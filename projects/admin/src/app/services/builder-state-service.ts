import { Injectable, signal } from '@angular/core';
import { Block } from 'page-builder';

@Injectable({
  providedIn: 'root'
})
export class BuilderStateService {
  // All blocks in the page
  blocks = signal<Block[]>([]);
  
  // Currently selected block ID
  selectedBlockId = signal<string | null>(null);

  // Add a new block
  addBlock(block: Block) {
    this.blocks.update(blocks => [...blocks, block]);
  }

  // Update a block
  updateBlock(id: string, updates: Partial<Block>) {
    this.blocks.update(blocks =>
      blocks.map(block => block.id === id ? { ...block, ...updates } : block)
    );
  }

  // Delete a block
  deleteBlock(id: string) {
    this.blocks.update(blocks => blocks.filter(block => block.id !== id));
  }

  // Select a block
  selectBlock(id: string | null) {
    this.selectedBlockId.set(id);
  }

  // Get selected block
  getSelectedBlock() {
    const id = this.selectedBlockId();
    if (!id) return null;
    return this.blocks().find(block => block.id === id) || null;
  }
}
