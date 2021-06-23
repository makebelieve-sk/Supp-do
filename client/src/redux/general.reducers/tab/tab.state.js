// Инициализация состояния вкладок
import {BodyManager} from "../../../components/content.components/body/body.component";
import {LogDOSection} from "../../../sections/logDOSection";

const initialState = {
    // Массив открытых вкладок
    tabs: [{title: "Журнал дефектов и отказов", content: BodyManager, key: "logDO", section: LogDOSection}],
    activeKey: "logDO",             // Активный ключ вкладки (ключ текущей вкладки)
    historyTabs: ["logDO"],         // История вкладок
    statisticKey: "statisticRating" // Активный ключ вкладки "Стаистика"
};

export default initialState;