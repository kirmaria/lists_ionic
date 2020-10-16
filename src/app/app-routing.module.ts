import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'auth/callback',
    loadChildren: './pages/auth/auth-callback/auth-callback.module#AuthCallbackPageModule'
  },
  {
    path: 'auth/endsession',
    loadChildren: './pages/auth/end-session/end-session.module#EndSessionPageModule'
  },
  {
    path: 'list-items',
    loadChildren: () => import('./pages/list-items/list-items.module').then( m => m.ListItemsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
