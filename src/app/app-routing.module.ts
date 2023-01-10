import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {path: ':translation/:book/:chapter', component: AppComponent},
  {path: '', component: AppComponent},
  // to do: error page '**'
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
