import { Injectable} from '@angular/core';
import {ToastController } from  'ionic-angular';

@Injectable()
export class ToastMessage {
  constructor( public toastCtrl: ToastController) {
  }

  showToastMessage(msg="",duration=2000){
    let toast = this.toastCtrl.create({
        message: '', cssClass: 'mytoast', duration: duration
      });
      toast.data.message =msg;
      toast.present(toast);
  }

}