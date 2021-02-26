import React from 'react';
import {Tooltip} from "antd";

import store from "../../redux/store";

// Создание заголовка таблицы
const headerProfessionTable = 'Наименование, Примечание';
const headerDepartmentTable = 'Наименование, Примечание, Подразделение';
const headerPersonTable = 'ФИО, Подразделение, Профессия, Примечание';
const headerTasksTable = 'Наименование, Примечание, Завершено';
const headerEquipmentPropertyTable = 'Наименование, Примечание';
const headerEquipmentTable = 'Принадлежит, Наименование, Примечание';
const headerLogDOTable = 'Дата заявки, Оборудование, Описание, Заявитель, Исполнитель, Задание, Состояние, Планируемая дата выполнения';

// Создание колонок для раздела "Профессии"
const ProfessionColumns = [
    {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Примечание',
        dataIndex: 'notes',
        key: 'notes',
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ['descend', 'ascend'],
    }
];

// Создание колонок для раздела "Подразделения"
const DepartmentColumns = [
    {
        title: 'Принадлежит',
        dataIndex: ['parent', 'name'],
        key: 'parent',
        width: 100,
        sorter: (a, b) => {
            if (a.parent && b.parent) {
                return a.parent.name.length - b.parent.name.length
            }
        },
        sortDirections: ['descend', 'ascend'],
        render(text, record) {
            const departments = store.getState().reducerDepartment.departments;
            let foundElement;

            if (departments && departments.length && record.parent) {
                foundElement = departments.find(item => item._id === record.parent._id);
            }

            return {
                children: <div>{foundElement ? foundElement.nameWithParent : text}</div>,
            };
        }
    },
    {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Примечание',
        dataIndex: 'notes',
        key: 'notes',
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ['descend', 'ascend'],
    }
];

// Создание колонок для раздела "Персонал"
const PersonColumns = [
    {
        title: 'ФИО',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Подразделение',
        dataIndex: ['department', 'name'],
        key: 'department',
        width: 100,
        sorter: (a, b) => {
            if (a.department && b.department) {
                return a.department.name.length - b.department.name.length
            }
        },
        sortDirections: ['descend', 'ascend'],
        render(text, record) {
            const departments = store.getState().reducerDepartment.departments;
            let foundElement;

            if (departments && departments.length && record.department) {
                foundElement = departments.find(item => item._id === record.department._id);
            }

            return {
                children: <div>{foundElement ? foundElement.nameWithParent : text}</div>,
            };
        }
    },
    {
        title: 'Профессия',
        dataIndex: ['profession', 'name'],
        key: 'profession',
        width: 100,
        sorter: (a, b) => {
            if (a.profession && b.profession) {
                return a.profession.name.length - b.profession.name.length
            }
        },
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Примечание',
        dataIndex: 'notes',
        key: 'notes',
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ['descend', 'ascend'],
    }
];

// Создание колонок для раздела "Состояние заявок"
const TasksColumns = [
    {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend', 'ascend'],
        render(text, record) {
            return {
                props: {
                    style: {background: record.color},
                },
                children: <div>{text}</div>,
            };
        },
    },
    {
        title: 'Примечание',
        dataIndex: 'notes',
        key: 'notes',
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ['descend', 'ascend'],
        render(text, record) {
            return {
                props: {
                    style: {background: record.color},
                },
                children: <div>{text}</div>,
            };
        },
    },
    {
        title: 'Завершено',
        dataIndex: 'isFinish',
        key: 'isFinish',
        width: 100,
        sorter: (a, b) => a.isFinish.length - b.isFinish.length,
        sortDirections: ['descend', 'ascend'],
        render(text, record) {
            return {
                props: {
                    style: {background: record.color},
                },
                children: <div>{text}</div>,
            };
        },
    },
];

// Создание колонок для раздела "Характеристики оборудования"
const EquipmentPropertyColumns = [
    {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Примечание',
        dataIndex: 'notes',
        key: 'notes',
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ['descend', 'ascend'],
    }
];

// Создание колонок для раздела "Перечень оборудования"
const EquipmentColumns = [
    {
        title: "Принадлежит",
        dataIndex: "parent",
        key: "parent",
        width: 100,
        sorter: (a, b) => {
            if (a.parent && b.parent) {
                return a.parent.name.length - b.parent.name.length
            }
        },
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Примечание',
        dataIndex: 'notes',
        key: 'notes',
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ['descend', 'ascend'],
    }
];

// Создание колонок для раздела "Журнал дефектов и отказов"
const LogDOColumns = [
    {
        title: "Дата заявки",
        dataIndex: "formattedDate",
        key: "date",
        width: 100,
        sorter: (a, b) => a.date > b.date,
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            if (record.state && record.state.color) {
                return {
                    props: {
                        style: {background: record.state.color},
                    },
                    children: <div>{text}</div>,
                };
            } else {
                return {
                    children: <div>{text}</div>,
                };
            }
        },
    },
    {
        title: "Оборудование",
        dataIndex: ["equipment", "name"],
        key: "equipment",
        width: 150,
        sorter: (a, b) => {
            if (a.equipment && b.equipment) {
                return a.equipment.name.length - b.equipment.name.length;
            }
        },
        sortDirections: ["descend", "ascend"],
        render: (text, record) => {
            const equipment = store.getState().reducerEquipment.equipment;
            let foundElement;

            if (equipment && equipment.length && record.equipment) {
                foundElement = equipment.find(item => item._id === record.equipment._id);
            }

            if (record.state && record.state.color) {
                return {
                    props: {
                        style: {background: record.state.color},
                    },
                    children: <div>{foundElement ? foundElement.nameWithParent : text}</div>,
                };
            } else {
                return {
                    children: <div>{foundElement ? foundElement.nameWithParent : text}</div>,
                };
            }
        },
    },
    {
        title: "Описание",
        dataIndex: "notes",
        key: 'notes',
        width: 150,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ['descend', 'ascend'],
        ellipsis: {
            showTitle: false,
        },
        render(text, record) {
            if (record.state && record.state.color) {
                return {
                    props: {
                        style: {background: record.state.color},
                    },
                    children: <Tooltip placement="topLeft" title={text}>
                        {text}
                    </Tooltip>,
                };
            } else {
                return {
                    children: <Tooltip placement="topLeft" title={text}>
                        {text}
                    </Tooltip>,
                };
            }
        },
    },
    {
        title: "Заявитель",
        dataIndex: ["applicant", "name"],
        key: "applicant",
        width: 100,
        sorter: (a, b) => {
            if (a.applicant && b.applicant) {
                return a.applicant.name.length - b.applicant.name.length;
            }
        },
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            if (record.state && record.state.color) {
                return {
                    props: {
                        style: {background: record.state.color},
                    },
                    children: <div>{text}</div>,
                };
            } else {
                return {
                    children: <div>{text}</div>,
                };
            }
        },
    },
    {
        title: "Исполнитель",
        dataIndex: ["responsible", "name"],
        key: "responsible",
        width: 110,
        sorter: (a, b) => {
            if (a.responsible && b.responsible) {
                return a.responsible.name.length - b.responsible.name.length;
            }
        },
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            if (record.state && record.state.color) {
                return {
                    props: {
                        style: {background: record.state.color},
                    },
                    children: <div>{text}</div>,
                };
            } else {
                return {
                    children: <div>{text}</div>,
                };
            }
        },
    },
    {
        title: "Задание",
        dataIndex: "task",
        key: "task",
        width: 150,
        ellipsis: {
            showTitle: false,
        },
        sorter: (a, b) => {
            if (a.task && b.task) {
                return a.task.length - b.task.length;
            }
        },
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            if (record.state && record.state.color) {
                return {
                    props: {
                        style: {background: record.state.color},
                    },
                    children: <Tooltip placement="topLeft" title={text}>
                        {text}
                    </Tooltip>,
                };
            } else {
                return {
                    children: <Tooltip placement="topLeft" title={text}>
                        {text}
                    </Tooltip>,
                };
            }
        },
    },
    {
        title: "Состояние",
        dataIndex: ["state", "name"],
        key: "state",
        width: 100,
        sorter: (a, b) => {
            if (a.state && b.state) {
                return a.state.name.length - b.state.name.length;
            }
        },
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            if (record.state && record.state.color) {
                return {
                    props: {
                        style: {background: record.state.color},
                    },
                    children: <div>{text}</div>,
                };
            } else {
                return {
                    children: <div>{text}</div>,
                };
            }
        },
    },
    {
        title: "Планируемая дата выполнения",
        dataIndex: "planDateDone",
        key: "planDateDone",
        width: 100,
        sorter: (a, b) => {
            if (a.planDateDone && b.planDateDone) {
                return a.planDateDone.length - b.planDateDone.length;
            }
        },
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            if (record.state && record.state.color) {
                return {
                    props: {
                        style: {background: record.state.color},
                    },
                    children: <div>{text}</div>,
                };
            } else {
                return {
                    children: <div>{text}</div>,
                };
            }
        },
    }
];

export {
    headerProfessionTable,
    headerDepartmentTable,
    headerPersonTable,
    headerTasksTable,
    headerEquipmentPropertyTable,
    headerEquipmentTable,
    headerLogDOTable,

    ProfessionColumns,
    DepartmentColumns,
    PersonColumns,
    TasksColumns,
    EquipmentPropertyColumns,
    EquipmentColumns,
    LogDOColumns
};