import React from 'react';

// Создание заголовка таблицы
const headerProfessionTable = 'Наименование, Примечание';
const headerDepartmentTable = 'Наименование, Примечание, Подразделение';
const headerPersonTable = 'Таб №, ФИО, Подразделение, Профессия, Примечание';
const headerTasksTable = 'Наименование, Примечание, Завершено';
const headerEquipmentPropertyTable = 'Наименование, Примечание';
const headerEquipmentTable = 'Принадлежит, Наименование, Примечание';
const headerLogDOTable = '№, Дата заявки, Оборудование, Описание, Заявитель, Ответственный, Подразделение, Задание, Состояние, Дата выполнения, Содержание работ, Работа принята';

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
        title: 'Таб №',
        dataIndex: 'tabNumber',
        key: 'tabNumber',
        width: 100,
        sorter: (a, b) => a.tabNumber - b.tabNumber,
        sortDirections: ['descend', 'ascend'],
    },
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
        title: '№',
        dataIndex: 'number',
        key: 'number',
        width: 100,
        sorter: (a, b) => a.number > b.number,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Дата заявки',
        dataIndex: 'date',
        key: 'date',
        width: 100,
        sorter: (a, b) => a.date > b.date,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: "Оборудование",
        dataIndex: ["equipment", "name"],
        key: "equipment",
        width: 100,
        sorter: (a, b) => {
            if (a.equipment && b.equipment) {
                return a.equipment.name.length - b.equipment.name.length;
            }
        },
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Описание",
        dataIndex: "notes",
        key: 'notes',
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Заявитель',
        dataIndex: 'applicant',
        key: 'applicant',
        width: 100,
        sorter: (a, b) => {
            if (a.applicant && b.applicant) {
                return a.applicant.name.length - b.applicant.name.length;
            }
        },
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Ответственный',
        dataIndex: 'responsible',
        key: 'responsible',
        width: 100,
        sorter: (a, b) => {
            if (a.responsible && b.responsible) {
                return a.responsible.name.length - b.responsible.name.length;
            }
        },
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Подразделение',
        dataIndex: 'department',
        key: 'department',
        width: 100,
        sorter: (a, b) => {
            if (a.department && b.department) {
                return a.department.name.length - b.department.name.length;
            }
        },
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Задание',
        dataIndex: 'task',
        key: 'task',
        width: 100,
        sorter: (a, b) => a.task.length - b.task.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Состояние',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        sorter: (a, b) => {
            if (a.state && b.state) {
                return a.state.name.length - b.state.name.length;
            }
        },
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Дата выполнения',
        dataIndex: 'dateDone',
        key: 'dateDone',
        width: 100,
        sorter: (a, b) => a.dateDone.length - b.dateDone.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Содержание работ',
        dataIndex: 'content',
        key: 'content',
        width: 100,
        sorter: (a, b) => a.content.length - b.content.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Работа принята',
        dataIndex: 'acceptTask',
        key: 'acceptTask',
        width: 100,
        sorter: (a, b) => {
            if (a.acceptTask && b.acceptTask) {
                return a.acceptTask.name.length - b.acceptTask.name.length;
            }
        },
        sortDirections: ['descend', 'ascend'],
    },
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