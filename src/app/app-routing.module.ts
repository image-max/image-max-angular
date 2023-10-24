import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestPageComponent } from './test-page/test-page.component';

const routes: Routes = [
  {
    path: '',
    resolve: {
      // at: AtResolver,
    },
    children: [
      {
        path: '',
        component: TestPageComponent,
      },
      {
        path: '**',
        component: TestPageComponent,
      },
    ],
  },
  {
    path: '**',
    component: TestPageComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
