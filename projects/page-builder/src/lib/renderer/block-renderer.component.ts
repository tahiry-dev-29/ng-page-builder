import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Block } from '../core/block.interface';
import { ContainerWidgetComponent } from '../widgets/container-widget.component';
import { TextWidgetComponent } from '../widgets/text-widget.component';
import { ImageWidgetComponent } from '../widgets/image-widget.component';
import { IconListWidgetComponent } from '../widgets/icon-list-widget.component';
import { ButtonWidgetComponent } from '../widgets/button-widget.component';

@Component({
  selector: 'pb-block-renderer',
  standalone: true,
  imports: [
    ContainerWidgetComponent,
    TextWidgetComponent,
    ImageWidgetComponent,
    IconListWidgetComponent,
    ButtonWidgetComponent
  ],
  template: `
    @switch (block().type) {
      @case ('container') {
        <pb-container-widget [block]="block()">
          @for (child of block().children; track child.id) {
            <pb-block-renderer [block]="child" />
          }
        </pb-container-widget>
      }
      @case ('grid') {
        <pb-container-widget [block]="block()">
          @for (child of block().children; track child.id) {
            <pb-block-renderer [block]="child" />
          }
        </pb-container-widget>
      }
      @case ('text') {
        <pb-text-widget [block]="block()" />
      }
      @case ('image') {
        <pb-image-widget [block]="block()" />
      }
      @case ('icon-list') {
        <pb-icon-list-widget [block]="block()" />
      }
      @case ('button') {
        <pb-button-widget [block]="block()" />
      }
      @default {
        <div>Unknown block type: {{ block().type }}</div>
      }
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockRendererComponent {
  block = input.required<Block>();
}
