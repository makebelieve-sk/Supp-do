// Инициализация состояния вкладок
import {BodyManager} from "../../../components/content.components/body/body.component";

const initialState = {
    tabs: [{title: "Журнал дефектов и отказов", content: BodyManager, key: "logDO"}],   // Массив открытых вкладок
    activeKey: "logDO",             // Активный ключ вкладки (ключ текущей вкладки)
    historyTabs: ["logDO"],         // История вкладок
};

export default initialState;