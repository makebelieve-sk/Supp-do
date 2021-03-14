// Изменение одного поля редактируемой записи
import {message} from "antd";

import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";

/**
 * Функция изменения поля редактируемой записи
 * @param key - ключ редактируемой записи
 * @param savedProfession - только что сохраненная профессия
 * @param savedDepartment - только что сохраненное подразделение
 * @param savedApplicant - только что сохраненный заявитель
 * @param savedEquipment - только что сохраненное оборудование
 * @param savedResponsible - только что сохраненный исполнитель
 * @param savedDepartmentDO - только что сохраненное подразделение в журнале ДО
 * @param savedState - только что сохраненное состояние заявки
 */
export default function setFieldRecord(key, savedProfession = null, savedDepartment = null,
        savedApplicant = null, savedEquipment = null, savedResponsible = null,
        savedDepartmentDO = null, savedState = null) {
    const itemPerson = store.getState().reducerPerson.rowDataPerson;
    const itemLogDO = store.getState().reducerLogDO.rowDataLogDO;

    // Карта соответствия ключа редактируемой вкладки и действием (изменение поля редактируемой записи)
    const map = new Map([
        ["personItem", () => store.dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson({
            ...itemPerson,
           profession: savedProfession ? savedProfession : itemPerson.profession,
           department: savedDepartment ? savedDepartment : itemPerson.department
        }))],
        ["logDOItem", () => store.dispatch(ActionCreator.ActionCreatorLogDO.setRowDataLogDO({
            ...itemLogDO,
            applicant: savedApplicant ? savedApplicant : itemLogDO.applicant,
            equipment: savedEquipment ? savedEquipment : itemLogDO.equipment,
            responsible: savedResponsible ? savedResponsible : itemLogDO.responsible,
            department: savedDepartmentDO ? savedDepartmentDO : itemLogDO.department,
            state: savedState ? savedState : itemLogDO.state
        }))]
    ]);

    if (map.has(key)) {
        map.get(key)();
    }
};