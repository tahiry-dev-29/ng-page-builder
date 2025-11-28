import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'editor',
    loadChildren: () => import('./features/editor/editor-routes').then(m => m.EDITOR_ROUTES)
  },
  {
    path: '',
    redirectTo: 'editor',
    pathMatch: 'full'
  }
];
