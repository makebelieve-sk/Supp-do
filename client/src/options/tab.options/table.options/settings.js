// Настройки таблицы
import Cookies from "js-cookie";

import filterTableKeys from "../../tab.options/table.options/filterTableKeys";
import {updateValueInStorage} from "../../../helpers/functions/general.functions/workWithCookies";
import {ActionCreator} from "../../../redux/combineActions";
import {StorageVars} from "../../global.options";

// Экспорт в эксель
const downloadCSV = async (table) => {
    const link = document.createElement("a");

    let csv = await convertArrayOfObjectsToCSV(table);

    if (csv === null) return;

    const title = table.title;  // Определение названия таблицы

    const filename = `${title}.csv`;

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
};
const convertArrayOfObjectsToCSV = async (table) => {
    let result, data = table.data;  // Данные обычных таблиц
    const treeData = table.initialData; // Данные древовидных таблиц

    if (treeData) {
        data = treeData;
    }

    const headerDataTable = table.header;
    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    // Фильтруем нужные для экспорта поля
    const filteredKeys = filterTableKeys(keys);

    result = "";
    result += headerDataTable;
    result += lineDelimiter;

    // Проверяем и форматируем каждое поле объекта данных
    data.forEach(item => {
        let ctr = 0;

        filteredKeys.forEach(key => {
            if (ctr > 0) result += columnDelimiter;

            if (key === "parent") {
                if (item.parent && item.parent.name) {
                    result += item.parent.name;
                } else {
                    result += "";
                }
            } else if (key === "content") {
                result += item[key].slice(0, 100) + "...";
            } else if (item[key] && item[key].name) {
                result += item[key].name;
            } else if (item[key] && typeof item[key] === "boolean") {
                if (item[key]) {
                    result += "Да";
                } else {
                    result += "Нет";
                }
            } else if (key === "during") {
                if (specKey === "statisticList") {
                    const during = item[key];

                    let days = Math.floor(during / 86400);
                    let hours = Math.floor((during - (days * 86400)) / 3600);
                    let minutes = Math.floor((during - (days * 86400) - (hours * 3600)) / 60);

                    if (days < 10) days = "0" + days;
                    if (hours < 10) hours = "0" + hours;
                    if (minutes < 10) minutes = "0" + minutes;

                    result += days + ":" + hours + ":" + minutes;
                } else {
                    const during = item[key];

                    let hours = Math.floor(during / 3600);
                    let minutes = Math.floor((during - (hours * 3600)) / 60);

                    if (hours < 10) hours = "0" + hours;
                    if (minutes < 10) minutes = "0" + minutes;

                    result += hours + ":" + minutes;
                }
            } else if (item[key]) {
                result += item[key];
            } else {
                result += "";
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