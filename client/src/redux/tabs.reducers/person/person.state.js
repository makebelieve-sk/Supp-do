// Инициализация состояния для раздела "Персонал"
import {Person} from "../../../model/Person";

const initialState = {
    people: [],                                                             // Записи раздела
    rowDataPerson: new Person({}),            // Редактируемая запись
    errorRecordPerson: null,                                                // Ошибка в записи
    errorTablePerson: null,                                                 // Ошибка в таблице
};

export default initialState;