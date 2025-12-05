import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { Block, getComputedStyles } from '../core/block.interface';
import { blockStylesToCSS, DeviceType } from '../core/style-util';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface VideoContent {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

@Component({
  selector: 'pb-video-widget',
  template: `
    <div class="video-wrapper" [style]="wrapperStyles()">
      @if (safeUrl()) {
        <iframe 
          [src]="safeUrl()" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          class="video-iframe"
        ></iframe>
      } @else {
        <div class="video-placeholder">
          <span class="material-symbols-outlined">play_circle</span>
        </div>
      }
    </div>
  `,
  styles: `
    .video-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
      background: #000;
    }
    .video-iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .video-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: #eee;
      color: #999;
      aspect-ratio: 16/9;
      
      .material-symbols-outlined {
        font-size: 48px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoWidgetComponent {
  block = input.required<Block>();
  device = input<DeviceType>('desktop');

  constructor(private sanitizer: DomSanitizer) {}

  wrapperStyles = computed(() => {
    const styles = getComputedStyles(this.block().styles, this.device(), false);
    const css = blockStylesToCSS(styles);
    
    // Handle aspect ratio
    const ratio = styles.aspectRatio || '16/9';
    css['aspect-ratio'] = ratio.replace('/', ' / ');
    
    return css;
  });

  safeUrl = computed<SafeResourceUrl | null>(() => {
    const data = this.block().data as VideoContent;
    if (!data?.src) return null;

    let url = data.src;
    // Simple YouTube embed conversion (very basic)
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      url = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      url = `https://www.youtube.com/embed/${videoId}`;
    }

    // Append params
    const params = [];
    if (data.autoplay) params.push('autoplay=1');
    if (data.loop) params.push('loop=1');
    if (data.muted) params.push('mute=1');
    
    if (params.length) {
      url += (url.includes('?') ? '&' : '?') + params.join('&');
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });
}
