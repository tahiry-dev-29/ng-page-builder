import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditorSidebarComponent } from '../editor-sidebar/editor-sidebar-component';

@Component({
  selector: 'app-editor-layout',
  standalone: true,
  imports: [RouterOutlet, EditorSidebarComponent],
  template: `
    <div class="flex h-screen bg-gray-100">
      <app-editor-sidebar></app-editor-sidebar>
      <main class="flex-1 overflow-hidden relative">
        <div class="absolute inset-0 p-8 overflow-auto">
            <div class="bg-white shadow-sm min-h-full rounded-lg">
                <router-outlet></router-outlet>
            </div>
        </div>
      </main>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorLayoutComponent {

}
