import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Block } from '../core/block.interface';
import { blockStylesToCSS } from '../core/style-util';

export interface ButtonContent {
  text: string;
  link?: string;
  type?: 'default' | 'info' | 'success' | 'warning' | 'danger';
  icon?: string;
  iconPosition?: 'before' | 'after';
  buttonId?: string;
}

@Component({
  selector: 'pb-button-widget',
  standalone: true,
  template: `
    <div class="button-wrapper" [style]="wrapperStyles()">
      <a 
        [href]="content().link || '#'" 
        class="button" 
        [class]="buttonClasses()"
        [style]="buttonStyles()"
        [id]="content().buttonId"
      >
        @if (content().icon && content().iconPosition !== 'after') {
          <span class="material-symbols-outlined icon">{{ content().icon }}</span>
        }
        
        <span class="text">{{ content().text || 'Click here' }}</span>
        
        @if (content().icon && content().iconPosition === 'after') {
          <span class="material-symbols-outlined icon">{{ content().icon }}</span>
        }
      </a>
    </div>
  `,
  styles: `
    .button-wrapper {
      display: flex;
    }
    
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      background-color: #61ce70;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
      font-size: 16px;
      line-height: 1;
    }

    .button:hover {
      opacity: 0.9;
    }

    /* Types */
    .button.info { background-color: #5bc0de; }
    .button.success { background-color: #5cb85c; }
    .button.warning { background-color: #f0ad4e; }
    .button.danger { background-color: #d9534f; }
    .button.default { background-color: #61ce70; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonWidgetComponent {
  block = input.required<Block>();

  content() {
    return (this.block().content as ButtonContent) || { text: 'Click here' };
  }

  wrapperStyles() {
    // Layout styles (alignment, margin) apply to wrapper
    const styles = this.block().styles || {};
    return {
      'justify-content': styles['justifyContent'] || 'flex-start',
      'margin': styles['margin']
    };
  }

  buttonStyles() {
    // Visual styles apply to button
    const styles = this.block().styles || {};
    return blockStylesToCSS({
      ...styles,
      margin: undefined // Margin is handled by wrapper
    });
  }

  buttonClasses() {
    return this.content().type || 'default';
  }
}
