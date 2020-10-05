import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StudyComponent } from './components/study/study.component';
import { ManageComponent } from './components/manage/manage.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CreditsComponent } from './components/credits/credits.component';

const routes: Routes = [
  {
    path: 'study',
    component: StudyComponent
  },
  {
    path: 'manage',
    component: ManageComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'credits',
    component: CreditsComponent
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
