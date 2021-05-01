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
import reducerAnalytic from "./tabs.reducers/analytic/analytic.reducer";
import reducerStatistic from "./tabs.reducers/statistic/statistic.reducer";
import reducerHelp from "./tabs.reducers/help/help.reducer";
import reducerUser from "./tabs.reducers/user/user.reducer";
import reducerRole from "./tabs.reducers/role/role.reducer";
import reducerAuth from "./general.reducers/auth/auth.reducer";

const appReducer = combineReducers({
    reducerProfession,
    reducerDepartment,
    reducerPerson,
    reducerTask,
    reducerEquipmentProperty,
    reducerTab,
    reducerLoading,
    reducerEquipment,
    reducerLogDO,
    reducerReplaceField,
    reducerAnalytic,
    reducerStatistic,
    reducerHelp,
    reducerUser,
    reducerRole,
    reducerAuth,
});

export const reducer = (state, action) => {
    // Если пользователь выходит из системы, приводим redux к начальному состоянию
    if (action.type === "USER_LOGOUT") {
        state = action.payload;
    }

    return appReducer(state, action);
}