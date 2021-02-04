import store from "../../redux/store";
import ActionCreator from "../../redux/actionCreators";
import {ContentTab} from "./contentTab";

// ��������� ������� ������� "���������"
const getContentProfession = async (add, request, tabs) => {
    // ������� ������ ������� '���������', ��� ����������� ��������
    add('���������', ContentTab, 'professions', tabs);

    const professions = await request('/api/directory/professions');

    // �������� ������� �������
    const currentTabs = store.getState().tabs;

    if (professions && professions.length > 0) {
        store.dispatch(ActionCreator.getAllProfessions(professions));

        add('���������', ContentTab, 'professions', currentTabs);
    }
};

// ��������� ������� ������� "���������"
const getContentDepartment = async (add, request, tabs) => {
    // ������� ������ ������� '�������������', ��� ����������� ��������
    add('�������������', ContentTab, 'departments', tabs);

    const departments = await request('/api/directory/departments');

    // �������� ������� �������
    const currentTabs = store.getState().tabs;

    if (departments && departments.length > 0) {
        store.dispatch(ActionCreator.getAllDepartments(departments));

        add('�������������', ContentTab, 'departments', currentTabs);
    }
};

// ��������� ������� ������� "���������"
const getContentPerson = async (add, request, tabs) => {
    // ������� ������ ������� '��������', ��� ����������� ��������
    add('��������', ContentTab, 'people', tabs);

    const people = await request('/api/directory/people');

    // �������� ������� �������
    const currentTabs = store.getState().tabs;

    if (people && people.length > 0) {
        store.dispatch(ActionCreator.getAllPeople(people));

        add('��������', ContentTab, 'people', currentTabs);
    }
};

// ��������� ������� ������� "�������� ������"
const getContentTestData = (add, request, tabs) => {
    // ������� ������ ������� '�������� ������', ��� ����������� ��������
    add('�������� ������', ContentTab, 'testData', tabs);

    const testData = require("../../test.json");

    // �������� ������� �������
    const currentTabs = store.getState().tabs;

    if (testData && testData.length > 0) {
        store.dispatch(ActionCreator.testData(testData));

        add('�������� ������', ContentTab, 'testData', currentTabs);
    }
};

// ��������� ������� ������� "��������� ������"
const getContentTaskStatus = async (add, request, tabs) => {
    // ������� ������ ������� '��������', ��� ����������� ��������
    add('��������� ������', ContentTab, 'tasks', tabs);

    const tasks = await request('/api/directory/taskStatus');

    // �������� ������� �������
    const currentTabs = store.getState().tabs;

    if (tasks && tasks.length > 0) {
        store.dispatch(ActionCreator.getAllTasks(tasks));

        add('��������� ������', ContentTab, 'tasks', currentTabs);
    }
};

export {
    getContentProfession,
    getContentDepartment,
    getContentPerson,
    getContentTestData,
    getContentTaskStatus
}