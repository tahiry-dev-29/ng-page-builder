import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/layout/main-layout-component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '**',
        loadComponent: () =>
          import('./features/page-viewer/page-viewer-component').then((m) => m.PageViewerComponent),
      },
    ],
  },
];
