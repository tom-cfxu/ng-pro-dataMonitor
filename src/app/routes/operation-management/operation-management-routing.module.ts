import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitorWorkOrderDispatchComponent } from './monitor-work-order-dispatch/monitor-work-order-dispatch.component';
import { OverhaulProgressDetailsComponent } from './overhaul-progress-details/overhaul-progress-details.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'monitor-work-order-dispatch',
    pathMatch: 'full'
  },
  {
    path: 'monitor-work-order-dispatch',
    component: MonitorWorkOrderDispatchComponent
  },
  {
    path: 'overhaul-progress-details',
    component: OverhaulProgressDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationManagementRoutingModule { }
