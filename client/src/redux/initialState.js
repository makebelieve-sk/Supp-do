import {ContentTab} from "../components/helpers/contentTab";

const initialState = {
    tabs: [{title: 'Профессии', content: ContentTab, key: 'professions'}],
    prevActiveTab: null,
    professions: [],
    departments: [],
    people: [],
    tasks: [],
    equipmentProperties: [],
    editTab: null,
    loadingSkeleton: false,
};

export default initialState;