// Создание заголовка таблицы
let headerProfessionTable = 'Наименование, Примечание';
let headerDepartmentTable = 'Наименование, Примечание, Подразделение';
let headerPersonTable = 'Таб №, ФИО, Подразделение, Профессия, Примечание';
let testDataHeader = 'OKZ, KC, NAME, ETKC, KOD';

// Создание колонок для раздела "Профессии"
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

// Создание колонок для раздела "Профессии"
const ProfessionColumns = [
    {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
    },
    {
        title: 'Примечание',
        dataIndex: 'notes',
        key: 'notes',
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ['descend'],
    }
];

// Создание колонок для раздела "Подразделения"
const DepartmentColumns = [
    {
        title: 'Принадлежит',
        dataIndex: ['parent', 'name'],
        key: 'parent',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
    },
    {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
    },
    {
        title: 'Примечание',
        dataIndex: 'notes',
        key: 'notes',
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ['descend'],
    }
];

// Создание колонок для раздела "Персонал"
const PersonColumns = [
    {
        title: 'Таб №',
        dataIndex: 'tabNumber',
        key: 'tabNumber',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
    },
    {
        title: 'ФИО',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
    },
    {
        title: 'Подразделение',
        dataIndex: ['department', 'name'],
        key: 'department',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
    },
    {
        title: 'Профессия',
        dataIndex: ['profession', 'name'],
        key: 'profession',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
    },
    {
        title: 'Примечание',
        dataIndex: 'notes',
        key: 'notes',
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ['descend'],
    }
];

export {
    headerProfessionTable,
    headerDepartmentTable,
    headerPersonTable,
    testDataHeader,

    ProfessionColumns,
    DepartmentColumns,
    PersonColumns,
    testData
};