// Создание глобального объекта reducer
import {combineReducers} from "redux";

import reducerProfession from "./tabs.reducers/profession/profession.reducer";
import reducerDepartment from "./tabs.reducers/department/department.reducer";
import reducerPerson from "./tabs.reducers/person/person.reducer";
import reducerTask from "./tabs.reducers/state/task.reducer";
import reducerEquipmentProperty from "./tabs.reducers/equipmentProperty/equipmentProperty.reducer";
import reducerTab from "./general.reducers/tab/tab.reducer";
import reducerLoading from "./general.reducers/loading/loading.reducer";
import reducerEquipment from "./tabs.reducers/equipment/equipment.reducer";
import reducerLogDO from "./tabs.reducers/logDo/logDO.reducer";
import reducerReplaceField from "./general.reducers/replaceField/replaceField.reducer";

export const reducer = combineReducers({
    reducerProfession,
    reducerDepartment,
    reducerPerson,
    reducerTask,
    reducerEquipmentProperty,
    reducerTab,
    reducerLoading,
    reducerEquipment,
    reducerLogDO,
    reducerReplaceField
});