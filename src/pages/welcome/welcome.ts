import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})



export class WelcomePage {

  checkLangEN:boolean;
  checkLangYB:boolean;
  

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService
    ) {
      this.translate.currentLang == 'en' ? this.checkLangEN = true : this.checkLangYB = true;
      this.translate.use('yb');
     }

  login() {
    this.navCtrl.push('LoginPage');
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

  signup() {
    this.navCtrl.push('SignupPage');
  }
}
