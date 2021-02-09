import {combineReducers} from "redux";

import reducerProfession from "./professionSection/profession.reducer";
import reducerDepartment from "./departmentSection/department.reducer";
import reducerPerson from "./personSection/person.reducer";
import reducerTask from "./taskSection/task.reducer";
import reducerEquipmentProperty from "./equipmentPropertySection/equipmentProperty.reducer";
import reducerTab from "./tab/tab.reducer";
import reducerLoading from "./loading/loading.reducer";
import reducerEquipment from "./equipmentSection/equipment.reducer";

export const reducer = combineReducers({
    reducerProfession,
    reducerDepartment,
    reducerPerson,
    reducerTask,
    reducerEquipmentProperty,
    reducerTab,
    reducerLoading,
    reducerEquipment,
});