import { Routes } from '@angular/router';
import { MainLayoutComponent } from './features/layout/main-layout-component';
import { PageViewerComponent } from './features/page-viewer/page-viewer-component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '**',
        component: PageViewerComponent
      }
    ]
  }
];
