const humps = require('humps');
const _ = require('lodash');
const jsonexport = require('jsonexport');
const fs = require('fs');
const DATA = require('./cellData.js');

const data = humps.camelizeKeys(DATA);
let id = 0;
function arrayToWrite(d) {
  const geneIds = _.get(d, 'geneID').split(', ');
  const geneSymbols = _.get(d, 'geneSymbol').split(', ');
  const restData = _.omit(d, ['geneID', 'geneSymbol', 'id']);
  let array = geneIds.map((geneId, idx) => {
    id += 1;
    return {
      id,
      ...restData,
      geneId: geneId.replace('[', '').replace(']', ''),
      geneSymbol: geneSymbols[idx] ? geneSymbols[idx].replace('[', '').replace(']', '') : geneSymbols[idx]
    };
  });

  return array;
}

const parentDataArray = [];
data.map(d => {
  const dataArray = arrayToWrite(d);
  dataArray.map(d => parentDataArray.push(humps.decamelizeKeys(d)));
});

async function writeDataToCSV(data) {
  jsonexport(data, function(err, csv) {
    if (err) return console.error(err);
    fs.writeFile('cell.csv', csv, function(err) {
      if (err) return console.error(err);
      console.log('cell.csv saved');
    });
  });
}

writeDataToCSV(parentDataArray);
