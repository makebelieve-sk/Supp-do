// Экшены для изменения полей при нажатии на "+"
import {
    SET_REPLACE_FIELD_PROFESSION,
    SET_REPLACE_FIELD_DEPARTMENT,
    SET_REPLACE_FIELD_PERSON,
    SET_REPLACE_FIELD_EQUIPMENT,
    SET_REPLACE_FIELD_EQUIPMENT_PROPERTY,
    SET_REPLACE_FIELD_STATE
} from "./replaceField.constants";

const ActionCreatorReplaceField = {
    setReplaceFieldProfession: (replaceField) => {
        return {
            type: SET_REPLACE_FIELD_PROFESSION,
            payload: replaceField
        }
    },
    setReplaceFieldDepartment: (replaceField) => {
        return {
            type: SET_REPLACE_FIELD_DEPARTMENT,
            payload: replaceField
        }
    },
    setReplaceFieldPerson: (replaceField) => {
        return {
            type: SET_REPLACE_FIELD_PERSON,
            payload: replaceField
        }
    },
    setReplaceFieldEquipment: (replaceField) => {
        return {
            type: SET_REPLACE_FIELD_EQUIPMENT,
            payload: replaceField
        }
    },
    setReplaceFieldEquipmentProperty: (replaceField) => {
        return {
            type: SET_REPLACE_FIELD_EQUIPMENT_PROPERTY,
            payload: replaceField
        }
    },
    setReplaceFieldState: (replaceField) => {
        return {
            type: SET_REPLACE_FIELD_STATE,
            payload: replaceField
        }
    }
}

export default ActionCreatorReplaceField;