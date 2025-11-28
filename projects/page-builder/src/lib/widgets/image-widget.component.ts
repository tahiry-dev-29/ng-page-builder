import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Block, ImageContent } from '../core/block.interface';
import { blockStylesToCSS } from '../core/style-util';

@Component({
  selector: 'pb-image-widget',
  standalone: true,
  template: `
    <img 
      [src]="imageSrc()" 
      [alt]="imageAlt()" 
      [style]="computedStyles()"
    >
  `,
  styles: `
    :host {
      display: block;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageWidgetComponent {
  block = input.required<Block>();

  computedStyles() {
    return blockStylesToCSS(this.block().styles);
  }

  imageSrc() {
    const content = this.block().content as ImageContent;
    return content?.src || '';
  }

  imageAlt() {
    const content = this.block().content as ImageContent;
    return content?.alt || '';
  }
}
