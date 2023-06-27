import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EngineComponent } from './components/engine/engine.component';
import { HomeComponent } from './components/home/home.component';
import { HistoryComponent } from './components/history/history.component';
import { ShowhistoryComponent } from './components/showhistory/showhistory.component';
import { SupportComponent } from './components/support/support.component';


const routes: Routes = [
  { path: '', component: StartComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [{ path: 'engine', component: EngineComponent },
    { path: 'home', component: HomeComponent },
    { path: 'historial', component: HistoryComponent },
    { path: 'support', component: SupportComponent }]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
