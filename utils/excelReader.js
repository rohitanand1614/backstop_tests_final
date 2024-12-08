const readXlsxFile = require('read-excel-file/node');

module.exports = async function readScenariosFromExcel(filePath) {
  const rows = await readXlsxFile(filePath);
  // rows: [ [ 'Path' ], [ '/' ], [ '/products' ], [ '/contact' ] ]

  const header = rows[0];
  const dataRows = rows.slice(1);

  const pathIndex = header.indexOf('Path');
  if (pathIndex === -1) {
    throw new Error("No 'Path' column found in the Excel file.");
  }

  const scenarios = dataRows.map(row => ({
    Path: row[pathIndex]
  }));

  return scenarios;
};
