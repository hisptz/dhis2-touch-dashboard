export const DATABASE_STRUCTURE = {
  organisationUnits: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'level', type: 'TEXT' },
      { value: 'path', type: 'TEXT' },
      { value: 'openingDate', type: 'TEXT' },
      { value: 'closedDate', type: 'TEXT' },
      { value: 'ancestors', type: 'LONGTEXT' },
      { value: 'parent', type: 'LONGTEXT' },
      { value: 'children', type: 'LONGTEXT' }
    ],
    isMetadata: true,
    resourceType: 'communication',
    batchSize: 500,
    displayName: 'Organisation Units',
    dependentTable: []
  },
  LOCAL_INSTANCE_KEY: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'currentLanguage', type: 'TEXT' },
      { value: 'currentUser', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    resourceType: '',
    batchSize: 500,
    displayName: 'Local instance',
    dependentTable: []
  }
};
