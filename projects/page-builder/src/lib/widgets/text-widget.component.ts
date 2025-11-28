import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Block, TextContent } from '../core/block.interface';
import { blockStylesToCSS } from '../core/style-util';

@Component({
  selector: 'pb-text-widget',
  standalone: true,
  template: `
    <div [style]="computedStyles()" [innerHTML]="textContent()"></div>
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

  computedStyles() {
    return blockStylesToCSS(this.block().styles);
  }

  textContent() {
    const content = this.block().content as TextContent;
    return content?.text || '';
  }
}
