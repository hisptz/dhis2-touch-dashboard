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
      // alert(dataSelection.filter)
    }
  });

  return {...analytics, metaData};
}
