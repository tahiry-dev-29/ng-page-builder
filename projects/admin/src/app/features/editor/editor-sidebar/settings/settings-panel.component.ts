import { Component, ChangeDetectionStrategy, signal, output, input, effect } from '@angular/core';
import { LayoutSettingsComponent } from './tabs/layout-settings.component';
import { AdvancedSettingsComponent } from './tabs/advanced-settings.component';
import { StyleSettingsComponent } from './tabs/style-settings.component';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [LayoutSettingsComponent, AdvancedSettingsComponent, StyleSettingsComponent],
  template: `
    <aside class="w-80 bg-white border-r border-gray-200 h-full flex flex-col font-sans text-gray-800">
      <!-- Header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <button 
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            (click)="onBack()"
          >
            <span class="material-symbols-outlined text-gray-600">arrow_back</span>
          </button>
          <h2 class="text-base font-bold">{{ widgetLabel() || 'Modifier Grille' }}</h2>
          <button class="p-1 hover:bg-gray-100 rounded transition-colors">
            <span class="material-symbols-outlined text-gray-600">more_vert</span>
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200">
        <button 
          class="flex-1 py-3 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1"
          [class.border-black]="activeTab() === 'layout'"
          [class.text-black]="activeTab() === 'layout'"
          [class.border-transparent]="activeTab() !== 'layout'"
          [class.text-gray-500]="activeTab() !== 'layout'"
          (click)="activeTab.set('layout')"
        >
          <span class="material-symbols-outlined text-base">grid_view</span>
          <span>{{ widgetType() === 'layout' ? 'Mise en page' : 'Contenu' }}</span>
        </button>
        <button 
          class="flex-1 py-3 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1"
          [class.border-black]="activeTab() === 'style'"
          [class.text-black]="activeTab() === 'style'"
          [class.border-transparent]="activeTab() !== 'style'"
          [class.text-gray-500]="activeTab() !== 'style'"
          (click)="activeTab.set('style')"
        >
          <span class="material-symbols-outlined text-base">palette</span>
          <span>Style</span>
        </button>
        <button 
          class="flex-1 py-3 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1"
          [class.border-black]="activeTab() === 'advanced'"
          [class.text-black]="activeTab() === 'advanced'"
          [class.border-transparent]="activeTab() !== 'advanced'"
          [class.text-gray-500]="activeTab() !== 'advanced'"
          (click)="activeTab.set('advanced')"
        >
          <span class="material-symbols-outlined text-base">settings</span>
          <span>Avancé</span>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 min-h-0">
        @if (activeTab() === 'layout') {
          <app-layout-settings [widgetType]="widgetType()" />
        } @else if (activeTab() === 'style') {
          <app-style-settings />
        } @else if (activeTab() === 'advanced') {
          <app-advanced-settings [widgetType]="widgetType()" />
        }
      </div>
    </aside>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPanelComponent {
  widgetType = input<string>('layout');
  widgetLabel = input<string>('');
  
  activeTab = signal<'layout' | 'style' | 'advanced'>('layout');
  back = output<void>();

  constructor() {
    // Set default tab based on widget type
    effect(() => {
      const type = this.widgetType();
      if (type === 'layout') {
        this.activeTab.set('layout');
      } else {
        this.activeTab.set('style');
      }
    });
  }

  onBack() {
    this.back.emit();
  }
}
