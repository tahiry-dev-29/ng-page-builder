import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { Block, getComputedStyles } from '../core/block.interface';
import { blockStylesToCSS, DeviceType } from '../core/style-util';

@Component({
  selector: 'pb-container-widget',
  template: `
    <div 
      [style]="computedStyles()"
      (mouseenter)="isHovered.set(true)"
      (mouseleave)="isHovered.set(false)"
    >
      <ng-content />
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
}
