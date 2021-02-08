import {ContentTab} from "../../components/helpers/contentTab";

const initialState = {
    tabs: [{title: 'Профессии', content: ContentTab, key: 'professions'}],
    activeKey: 'professions',
    prevActiveTab: null
};

export default initialState;