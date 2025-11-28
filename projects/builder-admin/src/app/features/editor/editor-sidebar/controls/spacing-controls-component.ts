import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-spacing-controls',
  standalone: true,
  imports: [],
  template: `
    <div class="mb-4">
      <h3 class="text-sm font-medium mb-2">Spacing</h3>
      <!-- Spacing controls -->
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpacingControlsComponent {

}
