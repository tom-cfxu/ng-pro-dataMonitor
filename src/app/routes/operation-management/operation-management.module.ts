import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';
import { OperationManagementRoutingModule } from './operation-management-routing.module';
import { MonitorWorkOrderDispatchComponent } from './monitor-work-order-dispatch/monitor-work-order-dispatch.component';
import { OverhaulProgressDetailsComponent } from './overhaul-progress-details/overhaul-progress-details.component';


@NgModule({
  declarations: [MonitorWorkOrderDispatchComponent, OverhaulProgressDetailsComponent],
  imports: [
    CommonModule,
    OperationManagementRoutingModule,
    SharedModule
  ]
})
export class OperationManagementModule { }
