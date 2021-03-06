import { NgModule } from '@angular/core';
import { LayoutModule as CDKLayoutModule } from '@angular/cdk/layout';
import { SharedModule } from '@shared/shared.module';

import { PRO_ENTRYCOMPONENTS, PRO_COMPONENTS } from './pro/index';

// passport
import { LayoutPassportComponent } from './passport/passport.component';
import { WeekdayPipe } from '@brand/pipe/weekday.pipe';
const PASSPORT = [LayoutPassportComponent, WeekdayPipe];

@NgModule({
  imports: [SharedModule, CDKLayoutModule],
  entryComponents: PRO_ENTRYCOMPONENTS,
  declarations: [...PRO_COMPONENTS, ...PASSPORT],
  exports: [...PRO_COMPONENTS, ...PASSPORT],
})
export class LayoutModule { }
