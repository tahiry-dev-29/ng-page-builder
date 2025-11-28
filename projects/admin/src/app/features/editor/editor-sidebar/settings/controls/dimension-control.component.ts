import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { UnitControlComponent } from './unit-control.component';

@Component({
  selector: 'app-dimension-control',
  standalone: true,
  imports: [UnitControlComponent],
  template: `
    <app-unit-control 
      [label]="label()" 
      [placeholder]="'0'"
    />
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionControlComponent {
  label = input.required<string>();
}
