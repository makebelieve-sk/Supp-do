import {ContentTab} from "../components/helpers/contentTab";

const initialState = {
    tabs: [{title: 'Профессии', content: ContentTab, key: 'professions'}],
    prevActiveTab: null,
    professions: [],
    departments: [],
    people: [],
    editTab: null,
    testData: null
};

export default initialState;