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
import { Observable } from 'rxjs/Observable';
import { CurrentUser } from '../../../../models/current-user';
import { UserProvider } from '../../../../providers/user/user';
import { DataSetsProvider } from '../../../../providers/data-sets/data-sets';
import { ProgramsProvider } from '../../../../providers/programs/programs';
import { HttpClientProvider } from '../../../../providers/http-client/http-client';
import * as _ from 'lodash';

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ProfileProvider {
  constructor(
    private userProvider: UserProvider,
    private dataSetProvider: DataSetsProvider,
    private programProvider: ProgramsProvider,
    private httpProvider: HttpClientProvider
  ) {}

  getProfileContentDetails() {
    let profileContents = [
      {
        id: 'userProfile',
        name: 'User Profile',
        icon: 'assets/icon/profile.png'
      },
      {
        id: 'accountSetting',
        name: 'Account Setting',
        icon: 'assets/icon/profile-access.png'
      },
      {
        id: 'orgUnits',
        name: 'Assigned organisation units',
        icon: 'assets/icon/orgUnit.png'
      },
      { id: 'roles', name: 'Assigned roles', icon: 'assets/icon/roles.png' }
      // {
      //   id: 'program',
      //   name: 'Assigned programs',
      //   icon: 'assets/icon/program.png'
      // },
      // { id: 'form', name: 'Assigned entry forms', icon: 'assets/icon/form.png' }
    ];
    return profileContents;
  }

  getProfileInfoForm() {
    return [
      {
        id: 'firstName',
        valueType: 'TEXT',
        displayName: 'First name'
      },
      {
        id: 'surname',
        valueType: 'TEXT',
        displayName: 'Surname'
      },
      {
        id: 'email',
        valueType: 'EMAIL',
        displayName: 'E-mail'
      },
      {
        id: 'phoneNumber',
        valueType: 'PHONE_NUMBER',
        displayName: 'Mobile phone number'
      },
      {
        id: 'introduction',
        valueType: 'LONG_TEXT',
        displayName: 'Introduction'
      },
      {
        id: 'jobTitle',
        valueType: 'TEXT',
        displayName: 'Job title'
      },
      {
        id: 'gender',
        valueType: 'TEXT',
        displayName: 'Gender',
        optionSet: {
          options: [
            { id: 'gender_Male', code: 'gender_male', name: 'Male' },
            { id: 'gender_Female', code: 'gender_female', name: 'Female' },
            { id: 'gender_other', code: 'gender_other', name: 'Other' }
          ]
        }
      },
      {
        id: 'birthday',
        valueType: 'DATE',
        displayName: 'Birthday'
      },
      {
        id: 'nationality',
        valueType: 'TEXT',
        displayName: 'Nationality'
      },
      {
        id: 'employer',
        valueType: 'TEXT',
        displayName: 'Employer'
      },
      {
        id: 'education',
        valueType: 'TEXT',
        displayName: 'Education'
      },
      {
        id: 'interests',
        valueType: 'LONG_TEXT',
        displayName: 'Interests'
      },
      {
        id: 'languages',
        valueType: 'TEXT',
        displayName: 'Languages'
      }
    ];
  }

  /**
   *
   * @returns {Observable<any>}
   */
  getSavedUserData(currentUser: CurrentUser): Observable<any> {
    const userData = {};
    const { authorities } = currentUser;
    return new Observable(observer => {
      this.userProvider.getUserData().subscribe(
        (savedUserData: any) => {
          this.userProvider.getProfileInformation().subscribe(
            userProfile => {
              this.dataSetProvider.getAllDataSets(currentUser).subscribe(
                (dataSets: any) => {
                  this.programProvider.getAllPrograms(currentUser).subscribe(
                    programs => {
                      userData['userProfile'] = userProfile;
                      userData['orgUnits'] = this.getAssignedOrgUnits(
                        savedUserData
                      );
                      userData['roles'] = this.getUserRoles(savedUserData);
                      userData['program'] = this.getAssignedProgram(
                        savedUserData,
                        programs,
                        authorities
                      );
                      userData['form'] = this.getAssignedForm(
                        savedUserData,
                        dataSets,
                        authorities
                      );
                      observer.next(userData);
                      observer.complete();
                    },
                    error => {
                      observer.error(error);
                    }
                  );
                },
                error => {
                  observer.error(error);
                }
              );
            },
            error => {
              observer.error(error);
            }
          );
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  uploadingProfileInformation() {
    this.userProvider.getProfileInformation().subscribe(
      (data: any) => {
        const { status } = data;
        const url = '/api/25/me';
        if (!status) {
          this.httpProvider.put(url, data).subscribe(
            () => {},
            error => {
              console.log(
                'Error on updating profile : ' + JSON.stringify(error)
              );
            }
          );
        }
      },
      () => {}
    );
  }

  updateUserPassword(data): Observable<any> {
    return new Observable(observer => {
      const url = '/api/25/me';
      this.httpProvider.put(url, data).subscribe(
        res => {
          observer.next();
          observer.complete();
        },
        error => {
          const { message } = error;
          const resposne = message
            ? message
            : 'Fail to update user password ' + JSON.stringify(error);
          observer.error(resposne);
        }
      );
    });
  }

  /**
   * get user info
   * @param userData
   * @returns {any}
   */
  getUserInformation(userData) {
    let userInfo = {};
    let omittedKey = [
      'userRoles',
      'organisationUnits',
      'dataViewOrganisationUnits',
      'dataSets',
      'programs'
    ];
    Object.keys(userData).map(key => {
      if (omittedKey.indexOf(key) == -1) {
        let value = userData[key];
        if (Date.parse(value)) {
          value = value.split('T')[0];
        }
        userInfo[key] = value;
      }
    });
    return userInfo; //this.getArrayFromObject(userInfo);
  }

  /**
   * get user roles
   * @param userData
   * @returns {Array}
   */
  getUserRoles(userData) {
    let userRoles = [];
    if (userData && userData.userRoles) {
      userData.userRoles.map((userRole: any) => {
        userRoles = [...userRoles, userRole.name];
      });
    }
    return userRoles.sort();
  }

  /**
   * get assigned org units
   * @param userData
   * @returns {Array}
   */
  getAssignedOrgUnits(userData) {
    let organisationUnits = [];
    if (userData && userData.organisationUnits) {
      userData.organisationUnits.map((organisationUnit: any) => {
        if (organisationUnits.indexOf(organisationUnit.name) == -1) {
          organisationUnits.push(organisationUnit.name);
        }
      });
    }
    return organisationUnits.sort();
  }

  /**
   * get assigned program
   * @param userData
   * @returns {Array}
   */
  getAssignedProgram(userData, programs, authorities) {
    let assignedPrograms = [];
    if (authorities && _.indexOf(authorities, 'ALL') > -1) {
      assignedPrograms = _.map(programs, program => program.name);
    } else {
      programs.map((program: any) => {
        if (
          userData.programs &&
          _.indexOf(userData.programs, program.id) > -1
        ) {
          assignedPrograms.push(program.name);
        }
      });
    }

    return assignedPrograms.sort();
  }

  /**
   * get assigned form
   * @param userData
   * @returns {Array}
   */
  getAssignedForm(userData, dataSets, authorities) {
    let assignedDataSets = [];
    if (authorities && _.indexOf(authorities, 'ALL') > -1) {
      assignedDataSets = _.map(dataSets, dataSet => dataSet.name);
    } else {
      dataSets.map((dataSet: any) => {
        if (
          userData.dataSets &&
          _.indexOf(userData.dataSets, dataSet.id) > -1
        ) {
          assignedDataSets.push(dataSet.name);
        }
      });
    }
    return assignedDataSets.sort();
  }

  /**
   *
   * @param object
   * @returns {Array}
   */
  getArrayFromObject(object) {
    let array = [];
    for (let key in object) {
      let newValue = object[key];
      const id = key;
      if (newValue instanceof Object) {
        newValue = JSON.stringify(newValue);
      }
      let newKey = (key.charAt(0).toUpperCase() + key.slice(1))
        .replace(/([A-Z])/g, ' $1')
        .trim();
      array = [...array, { key: newKey, value: newValue, id: id }];
    }
    return array;
  }
}
