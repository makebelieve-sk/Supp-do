import {
    ADD_TAB,
    EDIT_TAB,
    REMOVE_TAB,

    CREATE_PROFESSION,
    EDIT_PROFESSION,
    DELETE_PROFESSION,
    GET_ALL_PROFESSIONS,
    SET_ROW_DATA_PROFESSION,

    CREATE_DEPARTMENT,
    EDIT_DEPARTMENT,
    DELETE_DEPARTMENT,
    GET_ALL_DEPARTMENTS,
    SET_ROW_DATA_DEPARTMENT,

    CREATE_PERSON,
    EDIT_PERSON,
    DELETE_PERSON,
    GET_ALL_PEOPLE,
    SET_ROW_DATA_PERSON,

    CREATE_TASK,
    EDIT_TASK,
    DELETE_TASK,
    GET_ALL_TASKS,
    SET_ROW_DATA_TASK,

    CREATE_EQUIPMENT_PROPERTY,
    EDIT_EQUIPMENT_PROPERTY,
    DELETE_EQUIPMENT_PROPERTY,
    GET_ALL_EQUIPMENT_PROPERTIES,
    SET_ROW_DATA_EQUIPMENT_PROPERTY,

    SET_ACTIVE_KEY,
    SET_PREV_ACTIVE_TAB,

    SET_LOADING_SKELETON
} from "./actionsConstants";

const ActionCreator = {
    // Добавление вкладки
    addTab: (tabContent) => {
        return {
            type: ADD_TAB,
            payload: tabContent
        }
    },
    // Редактируемая вкладка
    editTab: (index, row) => {
        return {
            type: EDIT_TAB,
            index: index,
            payload: row
        }
    },
    // Удаление вкладки
    removeTab: (index) => {
        return {
            type: REMOVE_TAB,
            payload: index
        }
    },

    // Добавление профессии
    createProfession: (profession) => {
        return {
            type: CREATE_PROFESSION,
            payload: profession
        }
    },
    // Изменение профессии
    editProfession: (index, editTab) => {
        return {
            type: EDIT_PROFESSION,
            payload: editTab,
            index: index
        }
    },
    // Удаление профессии
    deleteProfession: (index) => {
        return {
            type: DELETE_PROFESSION,
            payload: index
        }
    },
    // Добавление профессии
    getAllProfessions: (professions) => {
        return {
            type: GET_ALL_PROFESSIONS,
            payload: professions
        }
    },
    // Установка данных для строки раздела "Профессии"
    setRowDataProfession: (rowData) => {
        return {
            type: SET_ROW_DATA_PROFESSION,
            payload: rowData
        }
    },

    // Добавление подразделения
    createDepartment: (department) => {
        return {
            type: CREATE_DEPARTMENT,
            payload: department
        }
    },
    // Изменение подразделения
    editDepartment: (index, editTab) => {
        return {
            type: EDIT_DEPARTMENT,
            payload: editTab,
            index: index
        }
    },
    // Удаление подразделения
    deleteDepartment: (index) => {
        return {
            type: DELETE_DEPARTMENT,
            payload: index
        }
    },
    // Добавление профессии
    getAllDepartments: (departments) => {
        return {
            type: GET_ALL_DEPARTMENTS,
            payload: departments
        }
    },
    // Установка данных для строки раздела "Подразделения"
    setRowDataDepartment: (rowData) => {
        return {
            type: SET_ROW_DATA_DEPARTMENT,
            payload: rowData
        }
    },

    // Добавление сотрудника
    createPerson: (profession) => {
        return {
            type: CREATE_PERSON,
            payload: profession
        }
    },
    // Изменение сотрудника
    editPerson: (index, editTab) => {
        return {
            type: EDIT_PERSON,
            payload: editTab,
            index: index
        }
    },
    // Удаление сотрудника
    deletePerson: (index) => {
        return {
            type: DELETE_PERSON,
            payload: index
        }
    },
    // Добавление профессии
    getAllPeople: (people) => {
        return {
            type: GET_ALL_PEOPLE,
            payload: people
        }
    },
    // Установка данных для строки раздела "Персонал"
    setRowDataPerson: (rowData) => {
        return {
            type: SET_ROW_DATA_PERSON,
            payload: rowData
        }
    },

    // Добавление записи о состоянии заявки
    createTask: (task) => {
        return {
            type: CREATE_TASK,
            payload: task
        }
    },
    // Изменение записи о состоянии заявки
    editTask: (index, editTab) => {
        return {
            type: EDIT_TASK,
            payload: editTab,
            index: index
        }
    },
    // Удаление записи о состоянии заявки
    deleteTask: (index) => {
        return {
            type: DELETE_TASK,
            payload: index
        }
    },
    // Добавление состояния заявок
    getAllTasks: (tasks) => {
        return {
            type: GET_ALL_TASKS,
            payload: tasks
        }
    },
    // Установка данных для строки раздела "Состояние заявок"
    setRowDataTask: (rowData) => {
        return {
            type: SET_ROW_DATA_TASK,
            payload: rowData
        }
    },

    // Добавление характеристики оборудования
    createEquipmentProperty: (equipmentProperty) => {
        return {
            type: CREATE_EQUIPMENT_PROPERTY,
            payload: equipmentProperty
        }
    },
    // Изменение характеристики оборудования
    editEquipmentProperty: (index, editTab) => {
        return {
            type: EDIT_EQUIPMENT_PROPERTY,
            payload: editTab,
            index: index
        }
    },
    // Удаление характеристики оборудования
    deleteEquipmentProperty: (index) => {
        return {
            type: DELETE_EQUIPMENT_PROPERTY,
            payload: index
        }
    },
    // Получение всех характеристик оборудования
    getAllEquipmentProperties: (equipmentProperties) => {
        return {
            type: GET_ALL_EQUIPMENT_PROPERTIES,
            payload: equipmentProperties
        }
    },
    // Установка данных для строки раздела "Характеристики оборудования"
    setRowDataEquipmentProperty: (rowData) => {
        return {
            type: SET_ROW_DATA_EQUIPMENT_PROPERTY,
            payload: rowData
        }
    },

    // Установка активной вкладки
    setActiveKey: (key) => {
        return {
            type: SET_ACTIVE_KEY,
            payload: key
        }
    },
    // Установка предыдущего активного таба
    setPrevActiveTab: (key) => {
        return {
            type: SET_PREV_ACTIVE_TAB,
            payload: key
        }
    },

    setLoadingSkeleton: (loading) => {
        return {
            type: SET_LOADING_SKELETON,
            payload: loading
        }
    },
}

export default ActionCreator;