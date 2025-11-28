import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-typography-controls',
  standalone: true,
  imports: [],
  template: `
    <div class="mb-4">
      <h3 class="text-sm font-medium mb-2">Typography</h3>
      <!-- Typography controls -->
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypographyControlsComponent {

}
