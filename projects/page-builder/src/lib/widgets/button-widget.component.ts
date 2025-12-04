import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { Block, ButtonContent, getComputedStyles } from '../core/block.interface';
import { blockStylesToCSS, DeviceType } from '../core/style-util';

@Component({
  selector: 'pb-button-widget',
  template: `
    <div class="button-wrapper">
      <a 
        [href]="content().link || '#'" 
        [target]="content().target || '_self'"
        [style]="computedStyles()"
        (mouseenter)="isHovered.set(true)"
        (mouseleave)="isHovered.set(false)"
      >
        @if (content().icon && content().iconPosition !== 'right') {
          <span class="material-symbols-outlined">{{ content().icon }}</span>
        }
        
        <span>{{ content().text || 'Click here' }}</span>
        
        @if (content().icon && content().iconPosition === 'right') {
          <span class="material-symbols-outlined">{{ content().icon }}</span>
        }
      </a>
    </div>
  `,
  styles: `
    .button-wrapper {
      display: inline-block;
    }
    
    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonWidgetComponent {
  block = input.required<Block>();
  device = input<DeviceType>('desktop');
  
  isHovered = signal(false);

  content = computed(() => {
    return (this.block().data as ButtonContent) || { text: 'Click here' };
  });

  computedStyles = computed(() => {
    const styles = getComputedStyles(
      this.block().styles, 
      this.device(), 
      this.isHovered()
    );
    return blockStylesToCSS(styles);
  });
}
