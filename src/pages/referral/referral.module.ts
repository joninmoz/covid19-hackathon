import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReferralPage } from './referral';

@NgModule({
  declarations: [
    ReferralPage,
  ],
  imports: [
    IonicPageModule.forChild(ReferralPage),
    TranslateModule.forChild()
  ],
})
export class ReferralPageModule {}
