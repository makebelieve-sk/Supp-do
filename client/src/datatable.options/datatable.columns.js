import React from 'react';

// Создание заголовка таблицы
const headerProfessionTable = 'Наименование, Примечание';
const headerDepartmentTable = 'Наименование, Примечание, Подразделение';
const headerPersonTable = 'Таб №, ФИО, Подразделение, Профессия, Примечание';
const headerTasksTable = 'Наименование, Примечание, Завершено';
const headerEquipmentPropertyTable = 'Наименование, Примечание';
const headerEquipmentTable = 'Принадлежит, Наименование, Примечание';

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
                    style: { background: record.color },
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
                    style: { background: record.color },
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
                    style: { background: record.color },
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

export {
    headerProfessionTable,
    headerDepartmentTable,
    headerPersonTable,
    headerTasksTable,
    headerEquipmentPropertyTable,
    headerEquipmentTable,

    ProfessionColumns,
    DepartmentColumns,
    PersonColumns,
    TasksColumns,
    EquipmentPropertyColumns,
    EquipmentColumns
};