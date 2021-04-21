// Состояние модели "Персонал"
import {Person} from "../../../model/Person";

const initialState = {
    people: [],                                                       // Записи раздела
    rowDataPerson: new Person({}),      // Редактируемая запись
    errorRecord: null,                                                // Ошибка в записи
    errorTable: null,                                                 // Ошибка в таблице
};

export default initialState;