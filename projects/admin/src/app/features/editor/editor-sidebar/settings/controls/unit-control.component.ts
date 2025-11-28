import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';

export type Unit = 'px' | '%' | 'em' | 'rem' | 'vh' | 'vw';

@Component({
  selector: 'app-unit-control',
  standalone: true,
  template: `
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <label class="text-xs font-medium text-gray-600">{{ label() }}</label>
        <div class="flex items-center gap-2">
          @if (showDeviceSelector()) {
            <span class="material-symbols-outlined text-gray-400 text-sm">desktop_windows</span>
          }
          <div class="relative group">
            <button 
              class="flex items-center gap-0.5 text-[10px] uppercase font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              (click)="unitMenuOpen.set(!unitMenuOpen())"
            >
              <span>{{ selectedUnit() }}</span>
              <span class="material-symbols-outlined text-[10px] transition-transform" [class.rotate-180]="unitMenuOpen()">expand_more</span>
            </button>
            
            @if (unitMenuOpen()) {
              <!-- Backdrop to close menu when clicking outside -->
              <div class="fixed inset-0 z-10" (click)="unitMenuOpen.set(false)"></div>
              
              <div class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 min-w-[80px] py-1">
                @for (unit of availableUnits(); track unit) {
                  <button
                    class="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors flex items-center justify-between group/item"
                    [class.bg-blue-50]="selectedUnit() === unit"
                    [class.text-blue-600]="selectedUnit() === unit"
                    [class.text-gray-600]="selectedUnit() !== unit"
                    (click)="selectUnit(unit)"
                  >
                    <span>{{ unit }}</span>
                    @if (selectedUnit() === unit) {
                      <span class="material-symbols-outlined text-[10px]">check</span>
                    }
                  </button>
                }
              </div>
            }
          </div>
        </div>
      </div>
      
      <div class="relative">
        <input 
          type="number" 
          [value]="value()"
          (input)="value.set(+$any($event.target).value)"
          class="w-full border border-gray-300 rounded px-3 py-2 pr-12 text-sm focus:border-blue-500 outline-none"
          [placeholder]="placeholder()"
        >
        <div class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
          {{ selectedUnit() }}
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitControlComponent {
  label = input.required<string>();
  placeholder = input('');
  showDeviceSelector = input(true);
  availableUnits = input<Unit[]>(['px', '%', 'em', 'rem', 'vh', 'vw']);
  
  value = signal(0);
  selectedUnit = signal<Unit>('px');
  unitMenuOpen = signal(false);

  selectUnit(unit: Unit) {
    this.selectedUnit.set(unit);
    this.unitMenuOpen.set(false);
  }
}
