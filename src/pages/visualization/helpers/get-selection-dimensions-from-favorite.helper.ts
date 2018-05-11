import * as _ from 'lodash';

export function getSelectionDimensionsFromFavorite(favoriteLayer) {
  // alert('Optins: ' + JSON.stringify(favoriteLayer.dataElementDimensions))
  const favoriteDataElements = _.map(favoriteLayer.dataElementDimensions,
    dataElementDimension => dataElementDimension.dataElement);
  return [
    ...getStandardizedDimensions(favoriteLayer.rows, favoriteDataElements, 'rows'),
    ...getStandardizedDimensions(favoriteLayer.columns, favoriteDataElements, 'columns'),
    ...getStandardizedDimensions(favoriteLayer.filters, favoriteDataElements, 'filters')
  ];
}

function getStandardizedDimensions(dimensions: any[], dataElements: any[], dimensionLayout: string) {
  // alert(JSON.stringify(dataElements))
  return _.map(dimensions, dimensionObject => {

    return {
      dimension: dimensionObject.dimension,
      layout: dimensionLayout,
      filter: dimensionObject.filter,
      items: _.map(dimensionObject.items, item => {
        const itemInfo = _.find(dataElements, 'id', item.id);
        return {id: item.dimensionItem || item.id, name: item.displayName, type: item.dimensionItemType, optionSet: itemInfo ? itemInfo.optionSet : null};
      })
    };
  });
}
