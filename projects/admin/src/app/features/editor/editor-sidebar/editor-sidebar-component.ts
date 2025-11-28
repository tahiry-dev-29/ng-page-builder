import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { WIDGETS } from './widget-list';
import { SettingsPanelComponent } from './settings/settings-panel.component';

@Component({
  selector: 'app-editor-sidebar',
  standalone: true,
  imports: [SettingsPanelComponent],
  template: `
    <!-- Toggle between Elements and Settings -->
    @if (currentView() === 'elements') {
      <aside class="w-80 bg-white border-r border-gray-200 h-full flex flex-col font-sans text-gray-800">
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 text-center">
          <h2 class="text-lg font-bold">Éléments</h2>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-200">
          <button 
            class="flex-1 py-3 text-sm font-medium border-b-2 transition-colors"
            [class.border-black]="activeTab() === 'widgets'"
            [class.text-black]="activeTab() === 'widgets'"
            [class.border-transparent]="activeTab() !== 'widgets'"
            [class.text-gray-500]="activeTab() !== 'widgets'"
            (click)="activeTab.set('widgets')"
          >
            Widgets
          </button>
          <button 
            class="flex-1 py-3 text-sm font-medium border-b-2 transition-colors"
            [class.border-black]="activeTab() === 'globals'"
            [class.text-black]="activeTab() === 'globals'"
            [class.border-transparent]="activeTab() !== 'globals'"
            [class.text-gray-500]="activeTab() !== 'globals'"
            (click)="activeTab.set('globals')"
          >
            Globales
          </button>
        </div>

        <!-- Content -->
        @if (activeTab() === 'widgets') {
          <div class="flex-1 overflow-y-auto p-4">
            <!-- Search -->
            <div class="relative mb-6">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
              <input 
                type="text" 
                placeholder="Rechercher un widget..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
                (input)="searchQuery.set($any($event.target).value)"
              >
            </div>

            <!-- Layout Category -->
            @if (layoutWidgets().length > 0) {
              <div class="mb-6">
                <div class="flex items-center mb-3 cursor-pointer" (click)="toggleCategory('layout')">
                  <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!isLayoutOpen()">arrow_drop_down</span>
                  <h3 class="text-sm font-bold">Mise en page</h3>
                </div>
                
                @if (isLayoutOpen()) {
                  <div class="grid grid-cols-2 gap-3">
                    @for (widget of layoutWidgets(); track widget.label) {
                      <div 
                        class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:shadow-md hover:border-gray-300 transition-all cursor-pointer bg-white group"
                        (click)="selectWidget(widget)"
                      >
                        <span class="material-symbols-outlined text-3xl text-gray-500 mb-2 group-hover:text-blue-600 transition-colors">{{ widget.icon }}</span>
                        <span class="text-xs text-gray-600 group-hover:text-gray-900">{{ widget.label }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            }

            <!-- Basic Category -->
            @if (basicWidgets().length > 0) {
              <div class="mb-6">
                <div class="flex items-center mb-3 cursor-pointer" (click)="toggleCategory('basic')">
                  <span class="material-symbols-outlined text-sm mr-2 transition-transform" [class.rotate-[-90deg]]="!isBasicOpen()">arrow_drop_down</span>
                  <h3 class="text-sm font-bold">Basique</h3>
                </div>
                
                @if (isBasicOpen()) {
                  <div class="grid grid-cols-2 gap-3">
                    @for (widget of basicWidgets(); track widget.label) {
                      <div 
                        class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:shadow-md hover:border-gray-300 transition-all cursor-pointer bg-white group"
                        (click)="selectWidget(widget)"
                      >
                        <span class="material-symbols-outlined text-3xl text-gray-500 mb-2 group-hover:text-blue-600 transition-colors">{{ widget.icon }}</span>
                        <span class="text-xs text-gray-600 group-hover:text-gray-900">{{ widget.label }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        } @else {
          <div class="flex-1 flex items-center justify-center text-gray-500 text-sm">
            Aucun élément global
          </div>
        }
      </aside>
    } @else {
      <app-settings-panel 
        [widgetType]="selectedWidget()?.category || 'layout'"
        [widgetLabel]="selectedWidget()?.label ? 'Modifier ' + selectedWidget()?.label : 'Modifier Grille'"
        (back)="currentView.set('elements')" 
      />
    }
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    /* Hide scrollbar for Chrome, Safari and Opera */
    .overflow-y-auto::-webkit-scrollbar {
      display: none;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    .overflow-y-auto {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorSidebarComponent {
  currentView = signal<'elements' | 'settings'>('settings'); // Default to settings for demo
  activeTab = signal<'widgets' | 'globals'>('widgets');
  searchQuery = signal('');
  selectedWidget = signal<any>(null);
  
  isLayoutOpen = signal(true);
  isBasicOpen = signal(true);

  layoutWidgets = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return WIDGETS.filter(w => w.category === 'layout' && w.label.toLowerCase().includes(query));
  });

  basicWidgets = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return WIDGETS.filter(w => w.category === 'basic' && w.label.toLowerCase().includes(query));
  });

  toggleCategory(category: 'layout' | 'basic') {
    if (category === 'layout') {
      this.isLayoutOpen.update(v => !v);
    } else {
      this.isBasicOpen.update(v => !v);
    }
  }

  selectWidget(widget: any) {
    // Store selected widget and switch to settings view
    this.selectedWidget.set(widget);
    this.currentView.set('settings');
  }
}
