import {ContentTab} from "../components/helpers/contentTab";

const initialState = {
    tabs: [{title: 'Профессии', content: ContentTab, key: 'profession'}],
    prevActiveTab: null,
    profession: [],
    departments: [],
    people: [],
    editTab: null
};

export default initialState;