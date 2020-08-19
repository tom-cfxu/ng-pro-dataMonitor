import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DistrictWaterUsageDetailsComponent } from './district-water-usage-details/district-water-usage-details.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { RealtimeDataMonitorComponent } from './realtime-data-monitor/realtime-data-monitor.component';
import { PipeNetworkDeploymentDetailsComponent } from './pipe-network-deployment-details/pipe-network-deployment-details.component';

@NgModule({
  declarations: [DistrictWaterUsageDetailsComponent, DistrictWaterUsageDetailsComponent, AnalysisComponent, RealtimeDataMonitorComponent, PipeNetworkDeploymentDetailsComponent],
  imports: [
    SharedModule,
    CommonModule,
    DashboardRoutingModule
  ],
  exports: [DistrictWaterUsageDetailsComponent, DistrictWaterUsageDetailsComponent, AnalysisComponent, RealtimeDataMonitorComponent, PipeNetworkDeploymentDetailsComponent]
})
export class DashboardModule { }
