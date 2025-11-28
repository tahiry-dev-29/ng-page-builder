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
          <div class="relative">
            <button 
              class="flex items-center gap-1 text-xs text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
              (click)="unitMenuOpen.set(!unitMenuOpen())"
            >
              <span>{{ selectedUnit() }}</span>
              <span class="material-symbols-outlined text-xs">expand_more</span>
            </button>
            
            @if (unitMenuOpen()) {
              <div class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[60px]">
                @for (unit of availableUnits(); track unit) {
                  <button
                    class="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors"
                    [class.bg-blue-50]="selectedUnit() === unit"
                    [class.text-blue-600]="selectedUnit() === unit"
                    (click)="selectUnit(unit)"
                  >
                    {{ unit }}
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
