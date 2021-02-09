import initialState from "./equipment.state";
import {
    CREATE_EQUIPMENT,
    EDIT_EQUIPMENT,
    DELETE_EQUIPMENT,
    GET_ALL_EQUIPMENT,
    SET_ROW_DATA_EQUIPMENT
} from "./equipment.constants";

export default function reducerEquipment(state = initialState, action) {
    switch (action.type) {
        case CREATE_EQUIPMENT:
            return {
                ...state,
                equipment: [ ...state.equipment, action.payload ]
            };
        case EDIT_EQUIPMENT:
            return {
                ...state,
                equipment: [ ...state.equipment.slice(0, action.index), action.payload,
                    ...state.equipment.slice(action.index + 1) ]
            };
        case DELETE_EQUIPMENT:
            return {
                ...state,
                equipment: [ ...state.equipment.slice(0, action.payload),
                    ...state.equipment.slice(action.payload + 1) ]
            };
        case GET_ALL_EQUIPMENT:
            return {
                ...state,
                equipment: action.payload
            };
        case SET_ROW_DATA_EQUIPMENT:
            return {
                ...state,
                rowDataEquipment:  action.payload
            };
        default:
            return state;
    }
};