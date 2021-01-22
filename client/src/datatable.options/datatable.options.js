// Русифицированный объект
const localeRu = {
    emptyText: 'Записи отсутствуют',
    triggerDesc: 'Нажмите для сортировки',
    triggerAsc: 'Нажмите для сортировки'
};

// Пагинация
const pagination = {
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '30']
};

// Экспорт в эксель
const downloadCSV = (array, name) => {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array, name);
    if (csv == null) return;

    const filename = `${name}.csv`;

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
};
const convertArrayOfObjectsToCSV = (array, name) => {
    let result, headerStr;

    if (name === 'profession') {
        headerStr = 'Наименование, Примечание';
    }
    if (name === 'department') {
        headerStr = 'Наименование, Примечание, Подразделение';
    }
    if (name === 'person') {
        headerStr = 'Таб №, ФИО, Подразделение, Профессия, Примечание';
    }

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    let keys = Object.keys(array[0]);

    keys.splice(0, 1);
    keys.splice(keys.length - 1, 1);

    result = '';
    result += headerStr;
    result += lineDelimiter;

    array.forEach(item => {
        let ctr = 0;
        keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter;

            if (item[key] && item[key].name) {
                result += item[key].name;
            } else if (item[key]) {
                result += item[key];
            } else {
                result += '';
            }

            ctr++;
        });

        result += lineDelimiter;
    });

    return result;
};

export {
    localeRu,
    downloadCSV,
    pagination
};