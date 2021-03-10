import {ExportMapHelper} from "../../components/helpers/table.helpers/tableMap.helper";

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
    let result;

    let headerDataTable = ExportMapHelper(name);

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    let keys = Object.keys(array[0]);

    console.log("До удаления: ", keys)
    if (name === "departments" || name === "equipment") {
        keys.splice(0, 2);
    } else {
        keys.splice(0, 1);
        keys.splice(keys.length - 2, 2);
    }
    console.log("После удаления: ", keys)

    result = '';
    result += headerDataTable;
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

// Объект настроек таблицы
const tableOptions = {
    pagination: {
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "30"]
    },
    export: downloadCSV,
    size: "small",
    scroll: {x: 500}
}

export default tableOptions;