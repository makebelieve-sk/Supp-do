import initialState from "./equipmentProperty.state";
import {
    CREATE_EQUIPMENT_PROPERTY,
    EDIT_EQUIPMENT_PROPERTY,
    DELETE_EQUIPMENT_PROPERTY,
    GET_ALL_EQUIPMENT_PROPERTIES,
    SET_ROW_DATA_EQUIPMENT_PROPERTY
} from "./equipmentProperty.constants";

export default function reducerEquipmentProperty(state = initialState, action) {
    switch (action.type) {
        case CREATE_EQUIPMENT_PROPERTY:
            return {
                ...state,
                equipmentProperties: [ ...state.equipmentProperties, action.payload ]
            };
        case EDIT_EQUIPMENT_PROPERTY:
            return {
                ...state,
                equipmentProperties: [ ...state.equipmentProperties.slice(0, action.index), action.payload,
                    ...state.equipmentProperties.slice(action.index + 1) ]
            };
        case DELETE_EQUIPMENT_PROPERTY:
            return {
                ...state,
                equipmentProperties: [ ...state.equipmentProperties.slice(0, action.payload),
                    ...state.equipmentProperties.slice(action.payload + 1) ]
            };
        case GET_ALL_EQUIPMENT_PROPERTIES:
            return {
                ...state,
                equipmentProperties: action.payload
            };
        case SET_ROW_DATA_EQUIPMENT_PROPERTY:
            return {
                ...state,
                rowDataEquipmentProperty:  action.payload
            };
        default:
            return state;
    }
};