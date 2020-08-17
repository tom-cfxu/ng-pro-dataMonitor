import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalysisComponent } from './analysis/analysis.component';
import { RealtimeDataMonitorComponent } from './realtime-data-monitor/realtime-data-monitor.component';
import { DistrictWaterUsageDetailsComponent } from './district-water-usage-details/district-water-usage-details.component';
import { OfficialWebsiteDeploymentDetailsComponent } from './official-website-deployment-details/official-website-deployment-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'analysis',
    pathMatch: 'full'
  },
  {
    path: 'analysis',
    component: AnalysisComponent
  },
  {
    path: 'realtime-data-monitor',
    component: RealtimeDataMonitorComponent
  },
  {
    path: 'district-water-usage-details',
    component: DistrictWaterUsageDetailsComponent
  },
  {
    path: 'official-website-deployment-details',
    component: OfficialWebsiteDeploymentDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
