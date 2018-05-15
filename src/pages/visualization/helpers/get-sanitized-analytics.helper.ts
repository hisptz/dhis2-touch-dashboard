import * as _ from 'lodash';

export function getSanitizedAnalytics(analytics: any, dataSelections) {
  if (!analytics) {
    return null;
  }

  const {headers, metaData} = analytics;

  // Check header with option set
  const headersWithOptionSet = _.filter(headers, analyticsHeader => analyticsHeader.optionSet);

  _.each(headersWithOptionSet, header => {
    const {optionSet} = _.find(dataSelections, ['dimension', header.name]);

    const headerOptions = optionSet ? optionSet.options : [];

    if (headerOptions.length > 0) {
      // Update metadata dimension
      if (metaData[header.name]) {
        metaData[header.name] = _.map(headerOptions, (option: any) => option.code || option.id);
      }

      // Update metadata names
      _.each(headerOptions, headerOption => {
        metaData.names[headerOption.code || headerOption.id] = headerOption.name;
      });
    }

  });

  // Check header with other dynamic dimensions
  const headersWithDynamicDimensionButNotOptionSet = _.filter(headers, (analyticsHeader: any) => {
    return (
      analyticsHeader.name !== 'dx' &&
      analyticsHeader.name !== 'pe' &&
      analyticsHeader.name !== 'ou' &&
      analyticsHeader.name !== 'value' &&
      !analyticsHeader.optionSet
    );
  });

  _.each(headersWithDynamicDimensionButNotOptionSet, header => {
    const dataSelection = _.find(dataSelections, ['dimension', header.name]);
    if (dataSelection) {
      const splittedFilter = dataSelection.filter ? dataSelection.filter.split(':') : [];
      const headerOptions = splittedFilter.length > 1 ?
        getFilterOptions(splittedFilter[0], parseInt(splittedFilter[1], 10)) :
        dataSelection.items.length > 0 ? _.map(dataSelection.items, item => {
          return {code: item.id, name: item.name};
        }) : [];

      if(headerOptions.length > 0) {
        // Update metadata dimension
        if (metaData[header.name]) {
          metaData[header.name] = _.map(headerOptions, (option: any) => option.code);
        }

        // Update metadata names
        _.each(headerOptions, headerOption => {
          metaData.names[headerOption.code] = headerOption.name;
        });
      }

    }
  });

  return {...analytics, metaData};
}

function getFilterOptions(operator: string, value: number) {
  alert(operator)
  switch (operator) {
    case 'LE':
      return _.times(value + 1, (valueItem: number) => {
        return {
          code: valueItem.toString(),
          name: valueItem.toString()
        };
      });
    default:
      return [];
  }
}

function getFilterNumberRange(filterString) {
  // todo add more mechanism for other operations
  const splitedFilter = filterString.split(':');
  let newNumberRange = [];
  if (splitedFilter[0] === 'LE') {
    const maxValue: number = parseInt(splitedFilter[1], 10);
    if (!isNaN(maxValue)) {
      newNumberRange = _.assign(
        [],
        _.times(maxValue + 1, (value: number) => {
          return {
            code: value.toString(),
            name: value.toString()
          };
        })
      );
    }
  } else if (splitedFilter[0] === 'LT') {
    const maxValue: number = parseInt(splitedFilter[1], 10);
    if (!isNaN(maxValue)) {
      newNumberRange = _.assign(
        [],
        _.times(maxValue, (value: number) => {
          return {
            code: value.toString(),
            name: value.toString()
          };
        })
      );
    }
  } else if (splitedFilter[0] === 'EQ') {
    newNumberRange = [
      {
        code: splitedFilter[1],
        name: splitedFilter[1]
      }
    ];
  } else if (splitedFilter[0] === 'GE') {
  } else if (splitedFilter[0] === 'GT') {
  } else if (splitedFilter[0] === 'NE') {
  }
  return newNumberRange;
}
