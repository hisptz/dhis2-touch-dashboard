import { createSelector } from '@ngrx/store';
import { getDashboardObjectEntities, getDashboardObjectState } from '../reducers';
import { getCurrentDashboardState } from '../reducers/dashboard.reducers';

export const getCurrentDashboardId = createSelector(getDashboardObjectState, getCurrentDashboardState);

export const getCurrentDashboard = createSelector(getDashboardObjectEntities, getCurrentDashboardId,
  (dashboardEntities, currentDashboardId) => dashboardEntities[currentDashboardId]);
