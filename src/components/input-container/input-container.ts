import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SettingsProvider } from '../../providers/settings/settings';
import { ActionSheetController } from 'ionic-angular';

/**
 * Generated class for the InputContainerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'input-container',
  templateUrl: 'input-container.html'
})
export class InputContainerComponent implements OnInit {
  @Input()
  dataElement;
  @Input()
  currentUser;
  @Input()
  data;
  @Input()
  dataValuesSavingStatusClass;
  @Input() lockingFieldStatus: boolean;
  @Output()
  onChange = new EventEmitter();

  fieldLabelKey: any;
  textInputField: Array<string>;
  numericalInputField: Array<string>;
  supportValueTypes: Array<string>;
  formLayout: string;
  dataEntrySettings: any;
  barcodeSettings: any;
  isLoading: boolean;

  constructor(
    private settingProvider: SettingsProvider,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.isLoading = true;
    this.numericalInputField = [
      'INTEGER_NEGATIVE',
      'INTEGER_POSITIVE',
      'INTEGER',
      'NUMBER',
      'INTEGER_ZERO_OR_POSITIVE'
    ];
    this.textInputField = ['TEXT', 'LONG_TEXT'];
    this.supportValueTypes = [
      'BOOLEAN',
      'TRUE_ONLY',
      'DATE',
      'DATETIME',
      'TIME',
      'TEXT',
      'LONG_TEXT',
      'INTEGER_NEGATIVE',
      'INTEGER_POSITIVE',
      'INTEGER',
      'NUMBER',
      'INTEGER_ZERO_OR_POSITIVE',
      'COORDINATE',
      'ORGANISATION_UNIT',
      'UNIT_INTERVAL',
      'PERCENTAGE',
      'EMAIL',
      'PHONE_NUMBER',
      'AGE'
    ];
  }

  ngOnInit() {
    this.settingProvider
      .getSettingsForTheApp(this.currentUser)
      .subscribe((appSettings: any) => {
        const dataEntrySettings = appSettings.entryForm;
        this.barcodeSettings = appSettings.barcode;
        this.dataEntrySettings = dataEntrySettings;
        this.fieldLabelKey = this.dataElement.displayName;
        if (dataEntrySettings.formLayout) {
          this.formLayout = dataEntrySettings.formLayout;
        } else {
          this.formLayout = 'listLayout';
        }
        if (dataEntrySettings.label) {
          if (
            this.dataElement[dataEntrySettings.label] &&
            isNaN(this.dataElement[dataEntrySettings.label])
          ) {
            this.fieldLabelKey = this.dataElement[dataEntrySettings.label];
          }
        }
        this.isLoading = false;
      });
  }

  getListLayoutLabel(categoryComboName, categoryOptionComboName) {
    let label = this.fieldLabelKey;
    if (categoryComboName != 'default') {
      label += ' ' + categoryOptionComboName;
    }
    return label;
  }

  showTooltips(dataElement, categoryComboName) {
    let title =
      this.fieldLabelKey +
      (categoryComboName != 'default' ? ' ' + categoryComboName : '');
    let subTitle = '';
    if (dataElement.description) {
      title += '. Description : ' + dataElement.description;
    }
    subTitle +=
      'Value Type : ' +
      dataElement.valueType.toLocaleLowerCase().replace(/_/g, ' ');
    if (dataElement.optionSet) {
      title +=
        '. It has ' +
        dataElement.optionSet.options.length +
        ' options to select.';
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: title,
      subTitle: subTitle
    });
    actionSheet.present();
  }

  updateValue(updatedValue) {
    this.dataValuesSavingStatusClass[updatedValue.id] =
      'input-field-container-saving';
    this.onChange.emit(updatedValue);
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }
}
