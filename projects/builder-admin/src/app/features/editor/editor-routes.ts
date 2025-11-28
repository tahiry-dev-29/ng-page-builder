import { Routes } from '@angular/router';
import { EditorLayoutComponent } from './layout/editor-layout-component';

export const EDITOR_ROUTES: Routes = [
  {
    path: '',
    component: EditorLayoutComponent,
    children: [
      // Child routes will go here
    ]
  }
];
