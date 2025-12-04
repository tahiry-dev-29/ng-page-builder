import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { Block, TextContent, getComputedStyles } from '../core/block.interface';
import { blockStylesToCSS, DeviceType } from '../core/style-util';

@Component({
  selector: 'pb-text-widget',
  template: `
    <div 
      [style]="computedStyles()" 
      [innerHTML]="textContent()"
      (mouseenter)="isHovered.set(true)"
      (mouseleave)="isHovered.set(false)"
    ></div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextWidgetComponent {
  block = input.required<Block>();
  device = input<DeviceType>('desktop');
  
  isHovered = signal(false);

  computedStyles = computed(() => {
    const styles = getComputedStyles(
      this.block().styles, 
      this.device(), 
      this.isHovered()
    );
    return blockStylesToCSS(styles);
  });

  textContent() {
    const content = this.block().data as TextContent;
    return content?.text || '';
  }
}
