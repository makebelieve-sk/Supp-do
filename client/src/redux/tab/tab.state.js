import {BodyManager} from "../../components/helpers/bodyManager";

const initialState = {
    tabs: [{title: 'Журнал дефектов и отказов', content: BodyManager, key: 'logDO'}],
    activeKey: 'logDO',
    prevActiveTab: null
};

export default initialState;