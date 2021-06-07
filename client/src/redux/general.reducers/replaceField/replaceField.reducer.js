// Инициализация редьюсера замены поля
import initialState from "./replaceField.state";
import {
    SET_REPLACE_FIELD_PROFESSION,
    SET_REPLACE_FIELD_DEPARTMENT,
    SET_REPLACE_FIELD_PERSON,
    SET_REPLACE_FIELD_EQUIPMENT,
    SET_REPLACE_FIELD_EQUIPMENT_PROPERTY,
    SET_REPLACE_FIELD_STATE
} from "./replaceField.constants";

export default function reducerReplaceField(state = initialState, action) {
    switch (action.type) {
        case SET_REPLACE_FIELD_PROFESSION:
            return {
                ...state,
                replaceFieldProfession: action.payload
            };
        case SET_REPLACE_FIELD_DEPARTMENT:
            return {
                ...state,
                replaceFieldDepartment: action.payload
            };
        case SET_REPLACE_FIELD_PERSON:
            return {
                ...state,
                replaceFieldPerson: action.payload
            };
        case SET_REPLACE_FIELD_EQUIPMENT:
            return {
                ...state,
                replaceFieldEquipment: action.payload
            };
        case SET_REPLACE_FIELD_EQUIPMENT_PROPERTY:
            return {
                ...state,
                replaceFieldEquipmentProperty: action.payload
            };
        case SET_REPLACE_FIELD_STATE:
            return {
                ...state,
                replaceFieldState: action.payload
            };
        default:
            return state;
    }
};