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
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { getRootState, State } from '../reducers';
import { DataSetAdapter, DataSetState } from '../reducers/data-set.reducer';

export const getDataSetEntityState = createSelector(
  getRootState,
  (state: State) => state.dataSet
);

export const getDataSetLoadedState = createSelector(
  getDataSetEntityState,
  (state: DataSetState) => state.loaded
);

export const {
  selectIds: getDataSetIds,
  selectEntities: getDataSetEntities,
  selectAll: getAllDataSets
} = DataSetAdapter.getSelectors(getDataSetEntityState);

export const getDataSetInformation = createSelector(
  getAllDataSets,
  (dataSets: any[]) => {
    return _.concat(
      [],
      _.map(dataSets, dataSet => {
        return {
          id: dataSet.id,
          name: dataSet.name
        };
      })
    );
  }
);

export const getDataElements = createSelector(getAllDataSets, dataSets => {
  return _.flatten(
    _.map(dataSets, (dataSet: any) => {
      return dataSet.dataElements
        ? dataSet.dataElements
        : _.map(dataSet.dataSetElements, 'dataElement');
    })
  );
});
