import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Block } from '../core/block.interface';
import { blockStylesToCSS } from '../core/style-util';

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
  standalone: true,
  template: `
    <ul class="icon-list" [style]="computedStyles()" [class.horizontal]="isHorizontal()">
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
      gap: var(--gap, 10px);
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
      gap: var(--icon-gap, 8px);
    }

    .icon {
      color: var(--icon-color, inherit);
      font-size: var(--icon-size, 14px);
    }

    .text {
      color: var(--text-color, inherit);
      font-size: var(--text-size, inherit);
      font-weight: var(--text-weight, inherit);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconListWidgetComponent {
  block = input.required<Block>();

  computedStyles() {
    const styles = this.block().styles || {};
    return {
      ...blockStylesToCSS(styles),
      '--gap': styles['gap'],
      '--icon-gap': styles['iconGap'],
      '--icon-color': styles['iconColor'],
      '--icon-size': styles['iconSize'],
      '--text-color': styles['textColor'],
      '--text-size': styles['textSize'],
      '--text-weight': styles['textWeight']
    };
  }

  items() {
    const content = this.block().content as IconListContent;
    return content?.items || [];
  }

  isHorizontal() {
    const content = this.block().content as IconListContent;
    return content?.layout === 'horizontal';
  }
}
