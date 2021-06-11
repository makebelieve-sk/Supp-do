// Настройки таблицы
import {getExportName, getTableHeader} from "../../../helpers/mappers/tabs.mappers/table.helper";
import filterTableKeys from "../../tab.options/table.options/filterTableKeys";
import {updateValueInStorage} from "../../../helpers/functions/general.functions/workWithCookies";
import {ActionCreator} from "../../../redux/combineActions";
import {StorageVars} from "../../global.options";
import Cookies from "js-cookie";

// Экспорт в эксель
const downloadCSV = (array, key) => {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array, key);
    if (csv == null) return;

    const filename = `${getExportName(key)}.csv`;

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
};
const convertArrayOfObjectsToCSV = (array, key) => {
    let result;

    const headerDataTable = getTableHeader(key);

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(array[0]);

    // Фильтруем нужные для экспорта поля
    const filteredKeys = filterTableKeys(keys);

    result = "";
    result += headerDataTable;
    result += lineDelimiter;

    array.forEach(item => {
        let ctr = 0;
        filteredKeys.forEach(key => {
            if (ctr > 0) result += columnDelimiter;

            if (item[key] && item[key].name) {
                result += item[key].name;
            } else if (item[key] && typeof item[key] === "boolean") {
                result += item[key];
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
const tableSettings = {
    pagination: {
        showTotal: (total, range) => `Записи с ${range[0]} по ${range[1]} из ${total}`,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
        onShowSizeChange: (_, size) => {
            const cookieValue = Cookies.get(StorageVars.pageSize);

            if (cookieValue) {
                const cookie = JSON.parse(Cookies.get(StorageVars.pageSize));

                updateValueInStorage(cookie, StorageVars.pageSize, size, ActionCreator.ActionCreatorMain.setPageSize);
            }
        }
    },
    export: downloadCSV,
    size: "small",
    scroll: { x: 500 }
}

export default tableSettings;