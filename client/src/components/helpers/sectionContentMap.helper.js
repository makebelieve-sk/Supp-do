import {
    getContentDepartment,
    getContentPerson,
    getContentProfession,
    getContentTestData
} from "./contentFunctions.helper";

import {message} from "antd";

// Создание мапы соответствия для функций открытия вкладок с таблицами
const OpenSectionContentHelper = (key, add, request, tabs) => {
    const sectionSelector = new Map([
        ['professions', getContentProfession],
        ['departments', getContentDepartment],
        ['people', getContentPerson],
        ['testData', getContentTestData],
    ]);

    if (sectionSelector.has(key)) {
        sectionSelector.get(key)(add, request, tabs);
    } else {
        let errorText = 'Возникли неполадки с ключем вкладки, попробуйте снова'
        message.error(errorText);
    }
};

export {
    OpenSectionContentHelper
}