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
import {
  smsCommandAdapter,
  SmsCommandState
} from '../reducers/sms-command.reducer';
import { SmsCommand } from '../../models';

export const getSmsCommandEntityState = createSelector(
  getRootState,
  (state: State) => state.smsCommand
);

export const getSmsCommandLoadedState = createSelector(
  getSmsCommandEntityState,
  (state: SmsCommandState) => state.loaded
);

export const {
  selectIds: getSmsCommandIds,
  selectEntities: getSmsCommandEntities,
  selectAll: getAllSmsCommands
} = smsCommandAdapter.getSelectors(getSmsCommandEntityState);

export const getSmsCommandMapper = createSelector(
  getAllSmsCommands,
  (smsCommands: SmsCommand[]) => {
    return _.keyBy(smsCommands, 'commandName');
  }
);
