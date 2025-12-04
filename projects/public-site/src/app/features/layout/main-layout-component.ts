import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-white">
      <header class="bg-white border-b border-gray-200 p-4">
        <div class="container mx-auto">
          <h1 class="text-xl font-bold">Public Site</h1>
        </div>
      </header>
      <main>
        <router-outlet />
      </main>
      <footer class="bg-gray-100 p-8 mt-8">
        <div class="container mx-auto text-center text-gray-500">
          &copy; 2026 Public Site
        </div>
      </footer>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {

}
