import {ContentTab} from "../components/helpers/contentTab";

const initialState = {
    tabs: [{title: 'Профессии', content: ContentTab, key: 'professions'}],
    prevActiveTab: null,
    professions: [],
    departments: [],
    people: [],
    tasks: [],
    editTab: null,
    loadingSkeleton: false,
    // Для теста==========================================
    testData: null
    // ===================================================
};

export default initialState;