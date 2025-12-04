import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { Block, getComputedStyles } from '../core/block.interface';
import { blockStylesToCSS, DeviceType } from '../core/style-util';

export interface IconListItem {
  text: string;
  icon: string;
  link?: string;
}

export interface IconListContent {
  items: IconListItem[];
  layout?: 'vertical' | 'horizontal';
}

@Component({
  selector: 'pb-icon-list-widget',
  template: `
    <ul 
      class="icon-list" 
      [style]="computedStyles()" 
      [class.horizontal]="isHorizontal()"
      (mouseenter)="isHovered.set(true)"
      (mouseleave)="isHovered.set(false)"
    >
      @for (item of items(); track $index) {
        <li class="icon-list-item">
          @if (item.link) {
            <a [href]="item.link" class="icon-list-link">
              <span class="material-symbols-outlined icon">{{ item.icon }}</span>
              <span class="text">{{ item.text }}</span>
            </a>
          } @else {
            <span class="icon-list-content">
              <span class="material-symbols-outlined icon">{{ item.icon }}</span>
              <span class="text">{{ item.text }}</span>
            </span>
          }
        </li>
      }
    </ul>
  `,
  styles: `
    .icon-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .icon-list.horizontal {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .icon-list-item {
      display: flex;
      align-items: center;
    }

    .icon-list-link, .icon-list-content {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: inherit;
      gap: 8px;
    }

    .icon {
      font-size: 18px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconListWidgetComponent {
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

  items = computed(() => {
    const content = this.block().data as IconListContent;
    return content?.items || [];
  });

  isHorizontal = computed(() => {
    const content = this.block().data as IconListContent;
    return content?.layout === 'horizontal';
  });
}
