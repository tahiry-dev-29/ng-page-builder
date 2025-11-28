import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Block } from '../core/block.interface';
import { blockStylesToCSS } from '../core/style-util';

@Component({
  selector: 'pb-container-widget',
  standalone: true,
  template: `
    <div [style]="computedStyles()">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerWidgetComponent {
  block = input.required<Block>();

  computedStyles() {
    return blockStylesToCSS(this.block().styles);
  }
}
