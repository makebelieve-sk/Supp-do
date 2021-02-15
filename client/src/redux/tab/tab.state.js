import {ContentTab} from "../../components/helpers/contentTab";

const initialState = {
    tabs: [{title: 'Оборудование', content: ContentTab, key: 'equipment'}],
    activeKey: 'equipment',
    prevActiveTab: null
};

export default initialState;