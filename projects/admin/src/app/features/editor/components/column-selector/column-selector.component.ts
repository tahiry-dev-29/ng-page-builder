import { Component, output, signal } from '@angular/core';

export interface ColumnPreset {
  label: string;
  icon: string; // Material symbol
  template: string; // grid-template-columns value
}

@Component({
  selector: 'app-column-selector',
  standalone: true,
  template: `
    <div class="overlay" (click)="cancel.emit()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>Structure</h3>
        <div class="presets">
          @for (preset of presets; track preset.label) {
            <button class="preset-btn" (click)="select.emit(preset.template)">
              <div class="preview" [style.grid-template-columns]="preset.template">
                @for (col of getCols(preset.template); track $index) {
                  <div class="col"></div>
                }
              </div>
              <span>{{ preset.label }}</span>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      min-width: 400px;
    }
    h3 { margin: 0 0 16px; text-align: center; }
    .presets {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .preset-btn {
      background: none;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 12px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      &:hover {
        border-color: #3b82f6;
        background: #eff6ff;
      }
    }
    .preview {
      display: grid;
      gap: 4px;
      width: 100%;
      height: 40px;
    }
    .col {
      background: #d1d5db;
      border-radius: 2px;
    }
  `
})
export class ColumnSelectorComponent {
  select = output<string>();
  cancel = output<void>();

  presets: ColumnPreset[] = [
    { label: '1 Colonne', icon: 'crop_square', template: '1fr' },
    { label: '2 Colonnes', icon: 'view_column', template: '1fr 1fr' },
    { label: '3 Colonnes', icon: 'view_week', template: '1fr 1fr 1fr' },
    { label: '4 Colonnes', icon: 'view_comfy', template: '1fr 1fr 1fr 1fr' },
    { label: 'Sidebar Gauche', icon: 'dock_to_left', template: '1fr 2fr' },
    { label: 'Sidebar Droite', icon: 'dock_to_right', template: '2fr 1fr' },
  ];

  getCols(template: string): number[] {
    return new Array(template.split(' ').length);
  }
}
