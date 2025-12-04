import { Component, ChangeDetectionStrategy, input, signal, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SliderUnit = 'px' | '%' | 'em' | 'rem' | 'vh' | 'vw' | 'fr' | 'deg' | '';

@Component({
  selector: 'app-slider-control',
  imports: [FormsModule],
  template: `
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <label class="text-xs font-medium text-gray-600">{{ label() }}</label>
        <div class="flex items-center gap-2">
          @if (availableUnits().length > 1) {
            <div class="relative">
              <button 
                class="flex items-center gap-0.5 text-[10px] uppercase font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                (click)="unitMenuOpen.set(!unitMenuOpen())"
                type="button"
              >
                <span>{{ currentUnit() }}</span>
                <span class="material-symbols-outlined text-[10px] transition-transform" [class.rotate-180]="unitMenuOpen()">expand_more</span>
              </button>
              
              @if (unitMenuOpen()) {
                <div class="fixed inset-0 z-10" (click)="unitMenuOpen.set(false)"></div>
                <div class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 min-w-[60px] py-1">
                  @for (unit of availableUnits(); track unit) {
                    <button
                      class="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors"
                      [class.bg-blue-50]="currentUnit() === unit"
                      [class.text-blue-600]="currentUnit() === unit"
                      (click)="selectUnit(unit)"
                      type="button"
                    >
                      {{ unit || 'none' }}
                    </button>
                  }
                </div>
              }
            </div>
          } @else {
            <span class="text-[10px] uppercase text-gray-400">{{ unit() }}</span>
          }
        </div>
      </div>
      <div class="flex items-center gap-3">
        <input 
          type="range" 
          [min]="min()" 
          [max]="max()" 
          [step]="step()"
          [value]="currentValue()"
          (input)="onValueChange($any($event.target).value)"
          class="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <input 
          type="number" 
          [value]="currentValue()"
          [step]="step()"
          (input)="onValueChange($any($event.target).value)"
          class="w-16 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:border-blue-500 outline-none"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderControlComponent {
  label = input.required<string>();
  min = input(0);
  max = input(100);
  step = input(1);
  unit = input<SliderUnit>('px');
  availableUnits = input<SliderUnit[]>(['px']);
  value = input<number>(0);
  
  // Output - emits value with unit like "16px"
  valueChange = output<string>();
  
  currentValue = signal(0);
  currentUnit = signal<SliderUnit>('px');
  unitMenuOpen = signal(false);

  constructor() {
    // Sync initial value
    effect(() => {
      this.currentValue.set(this.value());
    }, { allowSignalWrites: true });
    
    effect(() => {
      this.currentUnit.set(this.unit());
    }, { allowSignalWrites: true });
  }

  onValueChange(val: string | number) {
    const numVal = Number(val);
    this.currentValue.set(numVal);
    this.emitValue();
  }
  
  selectUnit(unit: SliderUnit) {
    this.currentUnit.set(unit);
    this.unitMenuOpen.set(false);
    this.emitValue();
  }
  
  private emitValue() {
    const val = this.currentValue();
    const unit = this.currentUnit();
    this.valueChange.emit(`${val}${unit}`);
  }
}
