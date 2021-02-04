import {
    ADD_TAB,
    EDIT_TAB,
    REMOVE_TAB,
    GET_ALL_PROFESSIONS,
    GET_ALL_DEPARTMENTS,
    GET_ALL_PEOPLE,
    GET_ALL_TASKS,
    GET_ALL_EQUIPMENT_PROPERTIES,
    CREATE_PROFESSION,
    EDIT_PROFESSION,
    DELETE_PROFESSION,
    CREATE_DEPARTMENT,
    EDIT_DEPARTMENT,
    DELETE_DEPARTMENT,
    CREATE_PERSON,
    EDIT_PERSON,
    DELETE_PERSON,
    CREATE_TASK,
    EDIT_TASK,
    DELETE_TASK,
    CREATE_EQUIPMENT_PROPERTY,
    EDIT_EQUIPMENT_PROPERTY,
    DELETE_EQUIPMENT_PROPERTY,
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
    getAllProfessions: (professions) => {
        return {
            type: GET_ALL_PROFESSIONS,
            payload: professions
        }
    },
    // Добавление профессии
    getAllDepartments: (departments) => {
        return {
            type: GET_ALL_DEPARTMENTS,
            payload: departments
        }
    },
    // Добавление профессии
    getAllPeople: (people) => {
        return {
            type: GET_ALL_PEOPLE,
            payload: people
        }
    },
    // Добавление состояния заявок
    getAllTasks: (tasks) => {
        return {
            type: GET_ALL_TASKS,
            payload: tasks
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