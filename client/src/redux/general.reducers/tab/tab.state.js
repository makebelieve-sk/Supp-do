import {BodyManager} from "../../../components/content.components/content.components/body/body.component";

const initialState = {
    tabs: [{title: "Журнал дефектов и отказов", content: BodyManager, key: "logDO"}],
    activeKey: "logDO",
    historyTabs: ["logDO"]
};

export default initialState;