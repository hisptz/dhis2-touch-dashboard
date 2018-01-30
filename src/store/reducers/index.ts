import {ActionReducerMap} from '@ngrx/store';
import {currentUserReducer, CurrentUserState} from "./currentUser.reducers";
import * as fromDashboardReducer from './dashboard.reducer';

export interface ApplicationState{
  currentUser : CurrentUserState,
  dashboard: fromDashboardReducer.DashboardState
}

export const reducers: ActionReducerMap<ApplicationState> = {
  currentUser : currentUserReducer,
  dashboard: fromDashboardReducer.dashboardReducer
};


export const getCurrentUserState = (state: ApplicationState) => state.currentUser;
