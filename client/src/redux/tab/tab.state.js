import {ContentTab} from "../../components/helpers/contentTab";

const initialState = {
    tabs: [{title: 'Журнал дефектов и отказов', content: ContentTab, key: 'logDO'}],
    activeKey: 'logDO',
    prevActiveTab: null
};

export default initialState;