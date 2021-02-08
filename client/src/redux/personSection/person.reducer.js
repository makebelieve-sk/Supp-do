import initialState from "./person.state";
import {
    CREATE_PERSON,
    EDIT_PERSON,
    DELETE_PERSON,
    GET_ALL_PEOPLE,
    SET_ROW_DATA_PERSON
} from "./person.constants";

export default function reducerPerson(state = initialState, action) {
    switch (action.type) {
        case CREATE_PERSON:
            return {
                ...state,
                people: [ ...state.people, action.payload ]
            };
        case EDIT_PERSON:
            let pIndex = action.index;
            return {
                ...state,
                people: [ ...state.people.slice(0, pIndex), action.payload, ...state.people.slice(pIndex + 1) ]
            };
        case DELETE_PERSON:
            let pI = action.payload;
            return {
                ...state,
                people: [ ...state.people.slice(0, pI), ...state.people.slice(pI + 1) ]
            };
        case GET_ALL_PEOPLE:
            return {
                ...state,
                people: action.payload
            };
        case SET_ROW_DATA_PERSON:
            return {
                ...state,
                rowDataPerson:  action.payload
            };
        default:
            return state;
    }
};