export const DATABASE_STRUCTURE = {
  LOCAL_INSTANCE_KEY : {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'name', type: 'TEXT'},
      {value : 'currentLanguage',type : 'TEXT'},
      {value: 'currentUser', type: 'LONGTEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize: 500,
    displayName: "Local instance",
    dependentTable: []
  }
};
