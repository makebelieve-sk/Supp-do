// Настройки таблицы
import Cookies from "js-cookie";

import {getExportName, getTableHeader} from "../../../helpers/mappers/tabs.mappers/table.helper";
import {getFilteredData} from "../../global.options";
import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";

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
    const filteredKeys = getFilteredData(keys);

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

const pageSize = "pageSize";   // Название поля в куки для сохранения количества записей на странице таблицы

// Объект настроек таблицы
const tableSettings = {
    pagination: {
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
        onShowSizeChange: (_, size) => {
            // Обновляем куки количества записей на странице таблицы
            const activeKey = store.getState().reducerTab.activeKey;

            const pageSizeObject = JSON.parse(Cookies.get(pageSize));

            pageSizeObject[activeKey] = size;

            store.dispatch(ActionCreator.ActionCreatorTab.setPageSize(pageSizeObject));

            Cookies.set(pageSize, pageSizeObject);
        }
    },
    export: downloadCSV,
    size: "small",
    scroll: { x: 500 }
}

export default tableSettings;