// Изменение одного поля редактируемой записи
import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import {message} from "antd";

/**
 * Функция изменения поля редактируемой записи
 * @param replaceField - содержит в себе ключ выпадающего списка (key) и текущие значения формы (formValues)
 * @param item - только что сохраненная запись
 */
export default function setFieldRecord(replaceField, item) {
    // Карта соответствия ключа редактируемой вкладки и действием (изменение поля редактируемой записи)
    const map = new Map([
        ["personProfession", () => {
            const formValues = store.getState().reducerReplaceField.replaceFieldProfession.formValues;
            const departments = store.getState().reducerDepartment.departments;

            store.dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson({
                ...formValues,
                profession: item,
                // По id подразделения находим объект подразделения или null
                department: formValues.department ?
                    departments.find(department => department._id === formValues.department) : null
            }));
        }],
        ["personDepartment", () => {
            const formValues = store.getState().reducerReplaceField.replaceFieldDepartment.formValues;
            const professions = store.getState().reducerProfession.professions;

            store.dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson({
                ...formValues,
                // По id профессии находим объект профессии или null
                profession: formValues.profession ?
                    professions.find(profession => profession._id === formValues.profession) : null,
                department: item
            }));
        }],
        ["equipmentEquipmentProperty", () => {
            const {formValues, index} = store.getState().reducerReplaceField.replaceFieldEquipmentProperty;
            const equipment = store.getState().reducerEquipment.equipment;
            const equipmentProperties = store.getState().reducerEquipmentProperty.equipmentProperties;

            if (formValues.properties && formValues.properties.length) {
                formValues.properties.forEach(object => {
                    object.equipmentProperty = object.equipmentProperty ?
                        equipmentProperties.find(eqProperty => eqProperty._id === object.equipmentProperty) : null;
                });

                formValues.properties[index].equipmentProperty = item;
            } else {
                formValues.properties = [{equipmentProperty: null, value: ""}];
            }

            store.dispatch(ActionCreator.ActionCreatorEquipment.setRowDataEquipment({
                ...formValues,
                // По id оборудования находим объект оборудования или null
                parent: formValues.parent ?
                    equipment.find(eq => eq._id === formValues.parent) : null
            }));
        }],
        ["logDOApplicant", () => {
            const formValues = store.getState().reducerReplaceField.replaceFieldPerson.formValues;

            store.dispatch(ActionCreator.ActionCreatorLogDO.setRowDataLogDO({
                ...formValues,
                applicant: item,
                applicantId: item._id
            }));
        }],
        ["logDODepartment", () => {
            const formValues = store.getState().reducerReplaceField.replaceFieldDepartment.formValues;

            store.dispatch(ActionCreator.ActionCreatorLogDO.setRowDataLogDO({
                ...formValues,
                department: item,
                departmentId: item._id
            }));
        }],
        ["logDOResponsible", () => {
            const formValues = store.getState().reducerReplaceField.replaceFieldPerson.formValues;
            const departments = store.getState().reducerDepartment.departments;

            store.dispatch(ActionCreator.ActionCreatorLogDO.setRowDataLogDO({
                ...formValues,
                responsible: item,
                responsibleId: item._id,
                department: item.department ? departments.find(department => department._id === item.department._id) : null,
                departmentId: item.department ? item.department._id : null
            }));
        }],
        ["logDOEquipment", () => {
            const formValues = store.getState().reducerReplaceField.replaceFieldEquipment.formValues;

            store.dispatch(ActionCreator.ActionCreatorLogDO.setRowDataLogDO({
                ...formValues,
                equipment: item,
                equipmentId: item._id
            }));
        }],
        ["logDOState", () => {
            const formValues = store.getState().reducerReplaceField.replaceFieldState.formValues;

            store.dispatch(ActionCreator.ActionCreatorLogDO.setRowDataLogDO({
                ...formValues,
                taskStatus: item,
                taskStatusId: item._id
            }));
        }],
        ["userPerson", () => {
            const formValues = store.getState().reducerReplaceField.replaceFieldPerson.formValues;

            store.dispatch(ActionCreator.ActionCreatorUser.setRowDataUser({
                ...formValues,
                person: item,
            }));
        }],
    ]);

    if (map.has(replaceField.key)) {
        map.get(replaceField.key)();
    } else {
        console.log(replaceField.key);
        message.error(`Раздел с ключём ${replaceField.key} не существует (изменение поля)`).then(null);
        return new Error(`Раздел с ключём ${replaceField.key} не существует (изменение поля)`);
    }
};