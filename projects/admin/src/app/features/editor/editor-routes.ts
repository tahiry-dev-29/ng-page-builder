import { Routes } from '@angular/router';

export const EDITOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/editor-layout-component').then((m) => m.EditorLayoutComponent),
    children: [
      // Child routes will go here
    ],
  },
];
