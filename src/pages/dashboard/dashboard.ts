import { Component, OnInit } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { Store } from '@ngrx/store';
import { DashboardState } from './store/reducers/';
import { LoadDashboardsAction } from './store/actions/dashboard.actions';
import { Observable } from 'rxjs/Observable';
import { getCurrentDashboard } from './store/selectors/dashboard.selectors';
import { Dashboard } from './models';
import { getCurrentDashboardVisualizations } from './store/selectors/dashboard-visualizations.selectors';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage implements OnInit {

  currentDashboard$: Observable<Dashboard>;
  currentDashboardVisualizations$: Observable<Array<string>>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private store: Store<DashboardState>,
    public modalCtrl: ModalController,) {
    this.currentDashboard$ = store.select(getCurrentDashboard);
    this.currentDashboardVisualizations$ = store.select(getCurrentDashboardVisualizations);
  }

  ionViewDidLoad() {

  }

  ngOnInit() {
    this.store.dispatch(new LoadDashboardsAction());
  }

  openDashboardListFilter() {
    let modal = this.modalCtrl.create('DashboardListFilterPage', {});
    modal.onDidDismiss(() => {
    });
    modal.present();
  }

}
