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

export {
    ProfessionColumns
};