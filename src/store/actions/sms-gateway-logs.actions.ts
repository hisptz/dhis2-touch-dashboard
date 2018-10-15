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
import { Action } from '@ngrx/store';
import { SmsGateWayLogs } from '../../models/sms-gateway-logs';

export enum SmsGatewayLogsActionTypes {
  AddSmsGateWayLogs = '[SMS Gateway] Adding sms gateway Logs',
  UpdateSmsGatewayLog = '[SMS Gateway] Update sms gateway log',
  UpdateSmsGatewayLogStatus = '[SMS Gateway] Update sms gateway log status',
  UpdateSmsGatewayLogFitlterKey = '[SMS Gateway] Update sms gateway log filter key'
}

export class AddSmsGateWayLogs implements Action {
  readonly type = SmsGatewayLogsActionTypes.AddSmsGateWayLogs;
  constructor(public payload: { logs: SmsGateWayLogs[] }) {}
}

export class UpdateSmsGatewayLogStatus implements Action {
  readonly type = SmsGatewayLogsActionTypes.UpdateSmsGatewayLogStatus;
  constructor(public payload: { status: string }) {}
}

export class UpdateSmsGatewayLogFitlterKey implements Action {
  readonly type = SmsGatewayLogsActionTypes.UpdateSmsGatewayLogFitlterKey;
  constructor(public payload: { filterKey: string }) {}
}

export class UpdateSmsGatewayLog implements Action {
  readonly type = SmsGatewayLogsActionTypes.UpdateSmsGatewayLog;
  constructor(public payload: { id: string; log: SmsGateWayLogs }) {}
}

export type SmsGatewayLogsActions =
  | AddSmsGateWayLogs
  | UpdateSmsGatewayLog
  | UpdateSmsGatewayLogStatus
  | UpdateSmsGatewayLogFitlterKey;
