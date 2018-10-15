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
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { DataSetActions, DataSetActionTypes } from '../actions';

export interface DataSetState extends EntityState<any> {
  loaded: boolean;
}

export const DataSetAdapter: EntityAdapter<any> = createEntityAdapter<any>();

const initialState: DataSetState = DataSetAdapter.getInitialState({
  loaded: false
});

export function dataSetReducer(
  state = initialState,
  action: DataSetActions
): DataSetState {
  switch (action.type) {
    case DataSetActionTypes.LoadDataSetSuccess: {
      return DataSetAdapter.addMany(action.payload.dataSets, {
        ...state,
        loaded: true
      });
    }
    default: {
      return state;
    }
  }
}
