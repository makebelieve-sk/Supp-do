// Русифицированный объект
const ruObject = {
    rowsPerPageText: 'Показать:',
    rangeSeparatorText: 'из',
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Все'
};
const noDataComponent = <div style={{padding: 30, fontSize: 18}}>Записи отсутствуют.</div>;

const paginationRowsPerPageOptions = [3, 5, 10, 20];

// Экспорт в эксель
const downloadCSV = (array) => {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
};
const convertArrayOfObjectsToCSV = (array) => {
    let result;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(array[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach(item => {
        let ctr = 0;
        keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];

            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
};

export {
    ruObject,
    noDataComponent,
    paginationRowsPerPageOptions,
    downloadCSV
};