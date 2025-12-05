import { Component, ChangeDetectionStrategy, signal, inject, computed, input } from '@angular/core';
import { ColorPickerControlComponent } from '../controls/color-picker-control.component';
import { SliderControlComponent } from '../controls/slider-control.component';
import { SelectControlComponent } from '../controls/select-control.component';
import { BuilderStateService } from '@admin/services/builder-state-service';
import { BlockStyles } from 'page-builder';

@Component({
  selector: 'app-style-settings',
  imports: [ColorPickerControlComponent, SliderControlComponent, SelectControlComponent],
  template: `
    <div class="p-4 overflow-y-auto h-full">
      @if (!selectedBlock()) {
        <div class="text-center text-gray-500 py-8">
          <span class="material-symbols-outlined text-3xl mb-2">touch_app</span>
          <p class="text-sm">Sélectionnez un élément pour modifier son style</p>
        </div>
      } @else {

        <!-- Image-specific styles -->
        @if (widgetType() === 'image') {
          <div class="mb-6">
            <div class="flex items-center mb-3 cursor-pointer" (click)="imageOpen.set(!imageOpen())">
              <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!imageOpen()">arrow_drop_down</span>
              <h3 class="text-sm font-bold">Image</h3>
            </div>
            @if (imageOpen()) {
              <app-slider-control 
                label="Largeur" 
                [min]="10" 
                [max]="100" 
                [value]="parseNumber(currentStyles().width)"
                [unit]="'%'"
                [availableUnits]="['%', 'px']"
                (valueChange)="updateStyle('width', $event)"
              />
              <app-slider-control 
                label="Hauteur max" 
                [min]="50" 
                [max]="800" 
                [value]="parseNumber(currentStyles().maxHeight) || 400"
                (valueChange)="updateStyle('maxHeight', $event)"
              />
              <app-select-control 
                label="Ajustement"
                [options]="['cover', 'contain', 'fill', 'none', 'scale-down']"
                [value]="currentStyles()['objectFit'] || 'cover'"
                (valueChange)="updateStyle('objectFit', $event)"
              />
              <app-select-control 
                label="Position"
                [options]="['center', 'top', 'bottom', 'left', 'right']"
                [value]="currentStyles()['objectPosition'] || 'center'"
                (valueChange)="updateStyle('objectPosition', $event)"
              />
              <app-slider-control 
                label="Opacité" 
                [min]="0" 
                [max]="100" 
                [value]="parseOpacity()"
                [unit]="'%'"
                (valueChange)="updateOpacity($event)"
              />
              <app-slider-control 
                label="Rayon" 
                [min]="0" 
                [max]="50" 
                [value]="parseNumber(currentStyles().borderRadius)"
                (valueChange)="updateStyle('borderRadius', $event)"
              />
            }
          </div>
        }

        <!-- Button-specific styles -->
        @if (widgetType() === 'button') {
          <div class="mb-6">
            <div class="flex items-center mb-3 cursor-pointer" (click)="buttonOpen.set(!buttonOpen())">
              <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!buttonOpen()">arrow_drop_down</span>
              <h3 class="text-sm font-bold">Bouton</h3>
            </div>
            @if (buttonOpen()) {
              <app-color-picker-control 
                label="Couleur de fond"
                [value]="currentStyles().backgroundColor || '#3b82f6'"
                (valueChange)="updateStyle('backgroundColor', $event)"
              />
              <app-color-picker-control 
                label="Couleur du texte"
                [value]="currentStyles().color || '#ffffff'"
                (valueChange)="updateStyle('color', $event)"
              />
              <app-slider-control 
                label="Rayon" 
                [min]="0" 
                [max]="50" 
                [value]="parseNumber(currentStyles().borderRadius)"
                (valueChange)="updateStyle('borderRadius', $event)"
              />
              <app-select-control 
                label="Largeur"
                [options]="['auto', '100%']"
                [value]="currentStyles().width || 'auto'"
                (valueChange)="updateStyle('width', $event)"
              />
            }
          </div>
        }

        <!-- Text/Heading styles -->
        @if (widgetType() === 'text' || widgetType() === 'heading') {
          <div class="mb-6">
            <div class="flex items-center mb-3 cursor-pointer" (click)="typographyOpen.set(!typographyOpen())">
              <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!typographyOpen()">arrow_drop_down</span>
              <h3 class="text-sm font-bold">Typographie</h3>
            </div>
            @if (typographyOpen()) {
              <app-select-control 
                label="Police"
                [options]="fontFamilies"
                [value]="currentStyles().fontFamily || 'inherit'"
                (valueChange)="updateStyle('fontFamily', $event)"
              />
              <app-slider-control 
                label="Taille" 
                [min]="8" 
                [max]="100" 
                [value]="parseFontSize()"
                [unit]="'px'"
                (valueChange)="updateStyle('fontSize', $event)"
              />
              <app-select-control 
                label="Graisse"
                [options]="fontWeights"
                [value]="currentStyles().fontWeight || 'normal'"
                (valueChange)="updateStyle('fontWeight', $event)"
              />
              <app-color-picker-control 
                label="Couleur"
                [value]="currentStyles().color || '#1f2937'"
                (valueChange)="updateStyle('color', $event)"
              />
              <app-select-control 
                label="Alignement"
                [options]="['left', 'center', 'right', 'justify']"
                [value]="currentStyles().textAlign || 'left'"
                (valueChange)="updateStyle('textAlign', $event)"
              />
            }
          </div>
        }

        <!-- Container/Grid styles -->
        @if (widgetType() === 'container' || widgetType() === 'grid') {
          <div class="mb-6">
            <div class="flex items-center mb-3 cursor-pointer" (click)="layoutOpen.set(!layoutOpen())">
              <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!layoutOpen()">arrow_drop_down</span>
              <h3 class="text-sm font-bold">Mise en page</h3>
            </div>
            @if (layoutOpen()) {
              <app-color-picker-control 
                label="Couleur de fond"
                [value]="currentStyles().backgroundColor || '#ffffff'"
                (valueChange)="updateStyle('backgroundColor', $event)"
              />
              <app-slider-control 
                label="Padding" 
                [min]="0" 
                [max]="100" 
                [value]="parseNumber(currentStyles().padding)"
                (valueChange)="updateStyle('padding', $event)"
              />
              <app-slider-control 
                label="Gap" 
                [min]="0" 
                [max]="50" 
                [value]="parseNumber(currentStyles().gap)"
                (valueChange)="updateStyle('gap', $event)"
              />
              <app-slider-control 
                label="Rayon bordure" 
                [min]="0" 
                [max]="50" 
                [value]="parseNumber(currentStyles().borderRadius)"
                (valueChange)="updateStyle('borderRadius', $event)"
              />
            }
          </div>
        }

        <!-- Divider styles -->
        @if (widgetType() === 'divider') {
          <div class="mb-6">
            <div class="flex items-center mb-3 cursor-pointer" (click)="dividerOpen.set(!dividerOpen())">
              <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!dividerOpen()">arrow_drop_down</span>
              <h3 class="text-sm font-bold">Séparateur</h3>
            </div>
            @if (dividerOpen()) {
              <app-color-picker-control 
                label="Couleur"
                [value]="parseBorderColor()"
                (valueChange)="updateDividerColor($event)"
              />
              <app-slider-control 
                label="Épaisseur" 
                [min]="1" 
                [max]="10" 
                [value]="parseBorderWidth()"
                (valueChange)="updateDividerWidth($event)"
              />
              <app-select-control 
                label="Style"
                [options]="['solid', 'dashed', 'dotted', 'double']"
                [value]="parseBorderStyle()"
                (valueChange)="updateDividerStyle($event)"
              />
            }
          </div>
        }

        <!-- Spacer styles -->
        @if (widgetType() === 'spacer') {
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <h3 class="text-sm font-bold">Espaceur</h3>
            </div>
            <app-slider-control 
              label="Hauteur" 
              [min]="10" 
              [max]="300" 
              [value]="parseNumber(currentStyles().height)"
              (valueChange)="updateStyle('height', $event)"
            />
          </div>
        }

        <!-- Video styles -->
        @if (widgetType() === 'video') {
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <h3 class="text-sm font-bold">Vidéo</h3>
            </div>
            <app-select-control 
              label="Ratio"
              [options]="['16/9', '4/3', '1/1', '21/9']"
              [value]="currentStyles()['aspectRatio'] || '16/9'"
              (valueChange)="updateStyle('aspectRatio', $event)"
            />
            <app-slider-control 
              label="Rayon" 
              [min]="0" 
              [max]="50" 
              [value]="parseNumber(currentStyles().borderRadius)"
              (valueChange)="updateStyle('borderRadius', $event)"
            />
          </div>
        }

        <!-- Icon List styles -->
        @if (widgetType() === 'icon-list') {
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <h3 class="text-sm font-bold">Liste d'icônes</h3>
            </div>
            
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-600 mb-2">Icône</label>
              <app-color-picker-control 
                label="Couleur"
                [value]="currentStyles()['--icon-color'] || '#3b82f6'"
                (valueChange)="updateStyle('--icon-color', $event)"
              />
              <app-slider-control 
                label="Taille" 
                [min]="10" 
                [max]="50" 
                [value]="parseNumber(currentStyles()['--icon-size']) || 14"
                (valueChange)="updateStyle('--icon-size', $event + 'px')"
              />
            </div>

            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-600 mb-2">Texte</label>
              <app-color-picker-control 
                label="Couleur"
                [value]="currentStyles().color || '#374151'"
                (valueChange)="updateStyle('color', $event)"
              />
              <app-slider-control 
                label="Espace" 
                [min]="0" 
                [max]="50" 
                [value]="parseNumber(currentStyles().gap)"
                (valueChange)="updateStyle('gap', $event)"
              />
            </div>
          </div>
        }

        <!-- Common border section (except for specific widgets) -->
        @if (!['button', 'divider', 'spacer'].includes(widgetType())) {
          <div class="mb-6">
            <div class="flex items-center mb-3 cursor-pointer" (click)="borderOpen.set(!borderOpen())">
              <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!borderOpen()">arrow_drop_down</span>
              <h3 class="text-sm font-bold">Bordure</h3>
            </div>
            @if (borderOpen()) {
              <app-slider-control 
                label="Rayon" 
                [min]="0" 
                [max]="50" 
                [value]="parseNumber(currentStyles().borderRadius)"
                (valueChange)="updateStyle('borderRadius', $event)"
              />
              <app-color-picker-control 
                label="Couleur"
                [value]="currentStyles().borderColor || ''"
                (valueChange)="updateBorder($event)"
              />
            }
          </div>
        }

        <!-- Common shadow section -->
        @if (['image', 'button', 'container'].includes(widgetType())) {
          <div class="mb-6">
            <div class="flex items-center mb-3 cursor-pointer" (click)="shadowOpen.set(!shadowOpen())">
              <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!shadowOpen()">arrow_drop_down</span>
              <h3 class="text-sm font-bold">Ombre</h3>
            </div>
            @if (shadowOpen()) {
              <app-select-control 
                label="Type"
                [options]="['none', 'sm', 'md', 'lg', 'xl']"
                [value]="parseShadow()"
                (valueChange)="updateShadow($event)"
              />
            }
          </div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StyleSettingsComponent {
  private builderState = inject(BuilderStateService);
  
  widgetType = input<string>('');

  imageOpen = signal(true);
  buttonOpen = signal(true);
  typographyOpen = signal(true);
  layoutOpen = signal(true);
  dividerOpen = signal(true);
  borderOpen = signal(false);
  shadowOpen = signal(false);

  fontFamilies = ['inherit', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana', 'Roboto', 'Open Sans', 'Inter'];
  fontWeights = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

  selectedBlock = computed(() => this.builderState.selectedBlock());
  
  currentStyles = computed(() => {
    const block = this.selectedBlock();
    const device = this.builderState.activeDevice();
    if (!block) return {} as BlockStyles;
    return block.styles[device] || block.styles.desktop || {};
  });

  parseFontSize(): number {
    const size = this.currentStyles().fontSize;
    if (!size) return 16;
    return parseInt(size.replace(/[^\d]/g, '')) || 16;
  }

  parseNumber(value: string | undefined): number {
    if (!value) return 0;
    return parseInt(value.replace(/[^\d]/g, '')) || 0;
  }

  parseOpacity(): number {
    const opacity = this.currentStyles().opacity;
    if (!opacity) return 100;
    return Math.round(parseFloat(opacity) * 100);
  }

  parseBorderColor(): string {
    const border = this.currentStyles()['borderTop'];
    if (!border) return '#e5e7eb';
    const match = border.match(/#[a-fA-F0-9]{3,6}/);
    return match ? match[0] : '#e5e7eb';
  }

  parseBorderWidth(): number {
    const border = this.currentStyles()['borderTop'];
    if (!border) return 1;
    const match = border.match(/(\d+)px/);
    return match ? parseInt(match[1]) : 1;
  }

  parseBorderStyle(): string {
    const border = this.currentStyles()['borderTop'];
    if (!border) return 'solid';
    if (border.includes('dashed')) return 'dashed';
    if (border.includes('dotted')) return 'dotted';
    if (border.includes('double')) return 'double';
    return 'solid';
  }

  parseShadow(): string {
    const shadow = this.currentStyles().boxShadow;
    if (!shadow || shadow === 'none') return 'none';
    if (shadow.includes('0 1px 2px')) return 'sm';
    if (shadow.includes('0 4px 6px')) return 'md';
    if (shadow.includes('0 10px 15px')) return 'lg';
    if (shadow.includes('0 25px 50px')) return 'xl';
    return 'none';
  }

  updateStyle(property: keyof BlockStyles, value: string) {
    const blockId = this.builderState.selectedBlockId();
    if (!blockId) return;
    
    const device = this.builderState.activeDevice();
    this.builderState.updateBlockStyles(blockId, device, { [property]: value });
  }

  updateOpacity(value: string) {
    const opacity = (parseFloat(value) / 100).toString();
    this.updateStyle('opacity', opacity);
  }

  updateDividerColor(color: string) {
    const width = this.parseBorderWidth();
    const style = this.parseBorderStyle();
    this.updateStyle('borderTop', `${width}px ${style} ${color}`);
  }

  updateDividerWidth(value: string) {
    const color = this.parseBorderColor();
    const style = this.parseBorderStyle();
    this.updateStyle('borderTop', `${value}px ${style} ${color}`);
  }

  updateDividerStyle(style: string) {
    const width = this.parseBorderWidth();
    const color = this.parseBorderColor();
    this.updateStyle('borderTop', `${width}px ${style} ${color}`);
  }

  updateBorder(color: string) {
    const blockId = this.builderState.selectedBlockId();
    if (!blockId) return;
    
    const device = this.builderState.activeDevice();
    this.builderState.updateBlockStyles(blockId, device, { 
      borderColor: color,
      borderWidth: '1px',
      borderStyle: 'solid'
    });
  }

  updateShadow(level: string) {
    const shadows: Record<string, string> = {
      'none': 'none',
      'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    };
    this.updateStyle('boxShadow', shadows[level] || 'none');
  }
}
