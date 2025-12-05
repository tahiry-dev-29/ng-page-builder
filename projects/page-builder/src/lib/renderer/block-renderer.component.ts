import { Component, ChangeDetectionStrategy, input, computed, signal, output } from '@angular/core';
import { CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Block, getComputedStyles, TextContent, SpacerContent, BlockDropEvent } from '../core/block.interface';
import { DeviceType, blockStylesToCSS } from '../core/style-util';
import { ContainerWidgetComponent } from '../widgets/container-widget.component';
import { TextWidgetComponent } from '../widgets/text-widget.component';
import { ImageWidgetComponent } from '../widgets/image-widget.component';
import { IconListWidgetComponent } from '../widgets/icon-list-widget.component';
import { ButtonWidgetComponent } from '../widgets/button-widget.component';
import { VideoWidgetComponent } from '../widgets/video-widget.component';

@Component({
  selector: 'pb-block-renderer',
  imports: [
    ContainerWidgetComponent,
    TextWidgetComponent,
    ImageWidgetComponent,
    IconListWidgetComponent,
    ButtonWidgetComponent,
    VideoWidgetComponent,
    CdkDropList
  ],
  template: `
    @switch (block().type) {
      @case ('container') {
        <pb-container-widget [block]="block()" [device]="device()">
          @if (editable()) {
            <div 
              class="drop-zone"
              cdkDropList
              [cdkDropListData]="block().children || []"
              (cdkDropListDropped)="onDrop($event)"
            >
              @for (child of block().children; track child.id) {
                <pb-block-renderer 
                  [block]="child" 
                  [device]="device()" 
                  [editable]="true"
                  (drop)="drop.emit($event)"
                />
              }
              @if (!block().children?.length) {
                <div class="empty-placeholder">Déposez ici</div>
              }
            </div>
          } @else {
            @for (child of block().children; track child.id) {
              <pb-block-renderer [block]="child" [device]="device()" />
            }
          }
        </pb-container-widget>
      }
      @case ('grid') {
        <pb-container-widget [block]="block()" [device]="device()">
          @if (editable()) {
            <div 
              class="drop-zone grid-zone"
              cdkDropList
              [cdkDropListData]="block().children || []"
              (cdkDropListDropped)="onDrop($event)"
            >
              @for (child of block().children; track child.id) {
                <pb-block-renderer 
                  [block]="child" 
                  [device]="device()" 
                  [editable]="true"
                  (drop)="drop.emit($event)"
                />
              }
            </div>
          } @else {
            @for (child of block().children; track child.id) {
              <pb-block-renderer [block]="child" [device]="device()" />
            }
          }
        </pb-container-widget>
      }
      @case ('heading') {
        <div 
          [style]="headingStyles()"
          (mouseenter)="isHovered.set(true)"
          (mouseleave)="isHovered.set(false)"
        >
          @switch (headingTag()) {
            @case ('h1') { <h1>{{ headingText() }}</h1> }
            @case ('h2') { <h2>{{ headingText() }}</h2> }
            @case ('h3') { <h3>{{ headingText() }}</h3> }
            @case ('h4') { <h4>{{ headingText() }}</h4> }
            @case ('h5') { <h5>{{ headingText() }}</h5> }
            @case ('h6') { <h6>{{ headingText() }}</h6> }
            @default { <h2>{{ headingText() }}</h2> }
          }
        </div>
      }
      @case ('text') {
        <pb-text-widget [block]="block()" [device]="device()" />
      }
      @case ('image') {
        <pb-image-widget [block]="block()" [device]="device()" />
      }
      @case ('button') {
        <pb-button-widget [block]="block()" [device]="device()" />
      }
      @case ('spacer') {
        <div [style]="spacerStyles()"></div>
      }
      @case ('divider') {
        <hr [style]="dividerStyles()" />
      }
      @case ('icon-list') {
        <pb-icon-list-widget [block]="block()" [device]="device()" />
      }
      @case ('video') {
        <pb-video-widget [block]="block()" [device]="device()" />
      }
      @default {
        <div class="unknown-block">
          <span class="material-symbols-outlined">error</span>
          Unknown: {{ block().type }}
        </div>
      }
    }
  `,
  styles: `
    :host {
      display: contents;
    }
    h1, h2, h3, h4, h5, h6 {
      margin: 0;
      font: inherit;
      color: inherit;
    }
    hr {
      border: none;
      margin: 0;
    }
    .unknown-block {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 4px;
      color: #92400e;
      font-size: 14px;
    }
    .drop-zone {
      min-height: 50px;
      height: 100%;
      width: 100%;
    }
    .empty-placeholder {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed #ccc;
      color: #999;
      font-size: 12px;
      margin: 4px;
      background: rgba(255,255,255,0.5);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockRendererComponent {
  block = input.required<Block>();
  device = input<DeviceType>('desktop');
  editable = input(false);
  
  drop = output<BlockDropEvent>();
  
  isHovered = signal(false);

  onDrop(event: CdkDragDrop<Block[], any>) {
    // Stop propagation if possible, but CdkDropList doesn't propagate by default.
    // However, we need to emit this up to the editor which has the state service.
    this.drop.emit({
      event,
      targetId: this.block().id
    });
  }

  // Heading helpers
  headingText = computed(() => {
    const data = this.block().data as TextContent;
    return data?.text || 'Heading';
  });

  headingTag = computed(() => {
    const data = this.block().data as TextContent;
    return data?.tag || 'h2';
  });

  headingStyles = computed(() => {
    const styles = getComputedStyles(this.block().styles, this.device(), this.isHovered());
    return blockStylesToCSS(styles);
  });

  // Spacer helper
  spacerStyles = computed(() => {
    const data = this.block().data as SpacerContent;
    const height = data?.height || '50px';
    return { height };
  });

  // Divider helper
  dividerStyles = computed(() => {
    const styles = getComputedStyles(this.block().styles, this.device(), false);
    return blockStylesToCSS(styles);
  });
}
