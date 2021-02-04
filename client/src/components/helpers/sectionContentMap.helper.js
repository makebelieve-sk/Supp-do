import {
    getContentDepartment,
    getContentPerson,
    getContentProfession, getContentTaskStatus,
    getContentTestData
} from "./contentFunctions.helper";

import {message} from "antd";

// �������� ���� ������������ ��� ������� �������� ������� � ���������
const OpenSectionContentHelper = (key, add, request, tabs) => {
    const sectionSelector = new Map([
        ['professions', getContentProfession],
        ['departments', getContentDepartment],
        ['people', getContentPerson],
        ['testData', getContentTestData],
        ['tasks', getContentTaskStatus],
    ]);

    if (sectionSelector.has(key)) {
        sectionSelector.get(key)(add, request, tabs);
    } else {
        let errorText = '�������� ��������� � ������ �������, ���������� �����'
        message.error(errorText);
    }
};

export {
    OpenSectionContentHelper
}