import {
    headerProfessionTable,
    headerDepartmentTable,
    headerPersonTable,
    testDataHeader,

    DepartmentColumns,
    PersonColumns,
    ProfessionColumns,
    testData
} from "../../datatable.options/datatable.columns";
import {getProfession, getDepartment, getPerson} from "./rowFunctions.helper";
import {message} from "antd";

// Создание мапы соответствия для функций открытия/редактирования вкладок
const RowMapHelper = (key, add, tabs, request, row) => {
    const rowSelector = new Map([
        ['professions', getProfession],
        ['departments', getDepartment],
        ['people', getPerson],
    ]);

    if (rowSelector.has(key)) {
        rowSelector.get(key)(add, tabs, request, row);
    } else {
        let errorText = 'Возникли неполадки с ключем вкладки, попробуйте снова'
        message.error(errorText);
    }
};

// Создание мапы соответствия для колонок таблицы
const ColumnsMapHelper = (key) => {
    let columns;
    const columnSelector = new Map([
        ['professions', ProfessionColumns],
        ['departments', DepartmentColumns],
        ['people', PersonColumns],
        ['testData', testData],
    ]);

    if (columnSelector.has(key)) {
        columns = columnSelector.get(key);
    } else {
        let errorText = 'Возникли неполадки с ключем вкладки, попробуйте снова'
        message.error(errorText);
    }

    return columns;
};

// Создание мапы соответствия заголовков таблицы
const ExportMapHelper = (key) => {
    let headerDataTable = '';

    const rowSelector = new Map([
        ['professions', headerProfessionTable],
        ['departments', headerDepartmentTable],
        ['people', headerPersonTable],
        ['testData', testDataHeader],
    ]);

    if (rowSelector.has(key)) {
        headerDataTable = rowSelector.get(key);
    } else {
        let errorText = 'Возникли неполадки с ключем вкладки, попробуйте снова'
        message.error(errorText);
    }

    return headerDataTable;
};

export {
    RowMapHelper,
    ColumnsMapHelper,
    ExportMapHelper
}