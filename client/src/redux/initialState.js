import {ContentTab} from "../components/contentTab";

const initialState = {
    tabs: [{title: 'Профессии', content: ContentTab, key: 'profession'}],
    profession: [],
    departments: [],
    people: [],
    editTab: null
};

export default initialState;