import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the ReferralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-referral',
  templateUrl: 'referral.html',
})
export class ReferralPage {

  checkLangEN:boolean;
  checkLangYB:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private translate:TranslateService) {
    this.translate.currentLang == 'en' ? this.checkLangEN = true : this.checkLangYB = true;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferralPage');
  }

  langChange(language){
    this.translate.use(language);

    console.log("LangChange Test", language);

    if(language == 'en'){ 
      this.checkLangEN = true;
      this.checkLangYB = false; 
    }else{
      this.checkLangYB = true;
      this.checkLangEN = false;
    }
  }

}
