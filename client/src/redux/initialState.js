import {ContentTab} from "../components/contentTab";

const initialState = {
    tabs: [{title: 'Профессии', content: ContentTab, key: 'profession'}],
    profession: [],
    editTab: null
};

export default initialState;