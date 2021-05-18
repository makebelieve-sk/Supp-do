// Инициализация состояния для вкладок
import {BodyManager} from "../../../components/content.components/body/body.component";



const initialState = {
    tabs: [{title: "Журнал дефектов и отказов", content: BodyManager, key: "logDO"}],
    activeKey: "logDO",
    historyTabs: ["logDO"],
    pageSizeOptions: null,
};

export default initialState;