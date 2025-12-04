import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { Block, ImageContent, getComputedStyles } from '../core/block.interface';
import { blockStylesToCSS, DeviceType } from '../core/style-util';

@Component({
  selector: 'pb-image-widget',
  template: `
    <figure 
      (mouseenter)="isHovered.set(true)"
      (mouseleave)="isHovered.set(false)"
    >
      <img 
        [src]="content().src" 
        [alt]="content().alt || ''" 
        [style]="computedStyles()"
      >
      @if (content().caption) {
        <figcaption>{{ content().caption }}</figcaption>
      }
    </figure>
  `,
  styles: `
    :host {
      display: block;
    }
    figure {
      margin: 0;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    figcaption {
      font-size: 14px;
      color: #6b7280;
      text-align: center;
      margin-top: 8px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageWidgetComponent {
  block = input.required<Block>();
  device = input<DeviceType>('desktop');
  
  isHovered = signal(false);

  content = computed(() => {
    return (this.block().data as ImageContent) || { src: '', alt: '' };
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
