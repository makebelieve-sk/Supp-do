// Инициализация состояния замены поля
// При нажатии на "+", запонимаем ключ выпадающего списка (key) и текущие значения формы (formValues)
const initialState = {
    // Изменение поля "Профессия"
    replaceFieldProfession: {
        key: null,
        formValues: null
    },
    // Изменение поля "Подразделение"
    replaceFieldDepartment: {
        key: null,
        formValues: null
    },
    // Изменение поля "Заявитель" и "Исполнитель"
    replaceFieldPerson: {
        key: null,
        formValues: null
    },
    // Изменение поля "Оборудование"
    replaceFieldEquipment: {
        key: null,
        formValues: null
    },
    // Изменение поля "Оборудование"
    replaceFieldEquipmentProperty: {
        key: null,
        formValues: null,
        index: null
    },
    // Изменение поля "Состояние"
    replaceFieldState: {
        key: null,
        formValues: null
    }
};

export default initialState;