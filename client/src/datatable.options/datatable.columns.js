// Создание заголовка таблицы
let headerProfessionTable = 'Наименование, Примечание';
let headerDepartmentTable = 'Наименование, Примечание, Подразделение';
let headerPersonTable = 'Таб №, ФИО, Подразделение, Профессия, Примечание';
// Для теста===============================================================
let testDataHeader = 'OKZ, KC, NAME, ETKC, KOD';
// ========================================================================
let headerTasksTable = 'Наименование, Примечание, Завершено';

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

// Для теста===============================================================
const testData = [
    {
        title: 'OKZ',
        dataIndex: 'OKZ',
        key: 'OKZ',
        width: 100,
        sorter: (a, b) => a.OKZ.length - b.OKZ.length,
        sortDirections: ['descend'],
    },
    {
        title: 'КС',
        dataIndex: 'KC',
        key: 'KC',
        width: 100,
        sorter: (a, b) => a.KC.length - b.KC.length,
        sortDirections: ['descend'],
    },
    {
        title: 'name',
        dataIndex: 'NAME',
        key: 'NAME',
        width: 100,
        sorter: (a, b) => a.NAME.length - b.NAME.length,
        sortDirections: ['descend'],
    },
    {
        title: 'ETKS',
        dataIndex: 'ETKS',
        key: 'ETKS',
        width: 100,
        sorter: (a, b) => a.ETKS.length - b.ETKS.length,
        sortDirections: ['descend'],
    },
    {
        title: 'Код',
        dataIndex: 'KOD',
        key: 'KOD',
        width: 100,
        sorter: (a, b) => a.KOD.length - b.KOD.length,
        sortDirections: ['descend'],
    }
];
// ===================================================

// Создание колонок для раздела "Состояние заявок"
const TasksColumns = [
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
    },
    {
        title: 'Завершено',
        dataIndex: 'isFinish',
        key: 'isFinish',
        width: 100,
        sorter: (a, b) => a.isFinish.length - b.isFinish.length,
        sortDirections: ['descend', 'ascend'],
    },
];

export {
    headerProfessionTable,
    headerDepartmentTable,
    headerPersonTable,
    testDataHeader,
    headerTasksTable,

    ProfessionColumns,
    DepartmentColumns,
    PersonColumns,
    testData,
    TasksColumns
};