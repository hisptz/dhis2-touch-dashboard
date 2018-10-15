/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  CurrentUserActionTypes,
  CurrentUserActions,
  LoadDataSetSuccess
} from '../actions';
import { DataSetsProvider } from '../../providers/data-sets/data-sets';
import { mergeMap, map } from 'rxjs/operators';

@Injectable()
export class DataSetEffects {
  constructor(
    private actions$: Actions,
    private dataSetProvider: DataSetsProvider
  ) {}

  @Effect()
  loadSmsCommands$: Observable<Action> = this.actions$.pipe(
    ofType<CurrentUserActions>(CurrentUserActionTypes.AddCurrentUser),
    mergeMap((action: any) =>
      this.dataSetProvider.getAllDataSets(action.payload.currentUser)
    ),
    map((dataSets: any[]) => new LoadDataSetSuccess({ dataSets }))
  );
}
