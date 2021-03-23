// Создание глобального объекта ActionCreator
import ActionCreatorProfession from "./tabs.reducers/profession/profession.actions";
import ActionCreatorDepartment from "./tabs.reducers/department/department.actions";
import ActionCreatorPerson from "./tabs.reducers/person/person.actions";
import ActionCreatorTask from "./tabs.reducers/state/task.actions";
import ActionCreatorEquipmentProperty from "./tabs.reducers/equipmentProperty/equipmentProperty.actions";
import ActionCreatorTab from "./general.reducers/tab/tab.actions";
import ActionCreatorLoading from "./general.reducers/loading/loading.actions";
import ActionCreatorEquipment from "./tabs.reducers/equipment/equipment.actions";
import ActionCreatorLogDO from "./tabs.reducers/logDo/logDO.actions";
import ActionCreatorReplaceField from "./general.reducers/replaceField/replaceField.actions";

export const ActionCreator = {
    ActionCreatorProfession,
    ActionCreatorDepartment,
    ActionCreatorPerson,
    ActionCreatorTask,
    ActionCreatorEquipmentProperty,
    ActionCreatorTab,
    ActionCreatorLoading,
    ActionCreatorEquipment,
    ActionCreatorLogDO,
    ActionCreatorReplaceField
}