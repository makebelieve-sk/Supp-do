// Фунции обёртки, добавлюящие доп функционал функциям вкладок
import moment from "moment";

import {onCancel, onChange, onDelete, onDropDownRender, onSave} from "./tab.functions";
import TabOptions from "../../../options/tab.options/tab.options";
import {request} from "../request.helper";
import {message} from "antd";
import {ActionCreator} from "../../../redux/combineActions";
import store from "../../../redux/store";

// Функция создания номера записи
const getNumberLog = (numberLog) => {
    if (numberLog.toString().length < 4) {
        return getNumberLog(`0${numberLog}`);
    } else {
        localStorage.setItem("numberLog", numberLog);
        return numberLog;
    }
}

// Функция, добавлюящая доп. функционал при сохранении записи в разделе "Журнал дефектов и отказов"
const onSaveHOCLogDO = (values, files, selectOptions, onSaveOptions) => {
    let numberLog = localStorage.getItem("numberLog");

    if (!numberLog) {
        numberLog = 0;
    }

    values.numberLog = getNumberLog(++numberLog) + "/" + moment().get("year");
    values.date = moment(values.date, TabOptions.dateFormat);
    values.applicant = selectOptions.selectPeople === "Не выбрано" ? null : selectOptions.selectPeople ?
        selectOptions.selectPeople : selectOptions.initialApplicant;
    values.equipment = selectOptions.selectEquipment === "Не выбрано" ? null : selectOptions.selectEquipment ?
        selectOptions.selectEquipment : selectOptions.initialEquipment;
    values.department = selectOptions.selectDep === "Не выбрано" ? null : selectOptions.selectDep ?
        selectOptions.selectDep : selectOptions.initialDepartment;
    values.responsible = selectOptions.selectResponsible === "Не выбрано" ? null : selectOptions.selectResponsible ?
        selectOptions.selectResponsible : selectOptions.initialResponsible;
    values.state = selectOptions.selectState === "Не выбрано" ? null : selectOptions.selectState ?
        selectOptions.selectState : selectOptions.initialState;
    values.dateDone = values.dateDone ? values.dateDone.format(TabOptions.dateFormat) : null;
    values.planDateDone = values.planDateDone ? values.planDateDone.format(TabOptions.dateFormat) : null;
    values.acceptTask = selectOptions.selectAcceptTask === "Не выбрано" ? null : selectOptions.selectAcceptTask ?
        selectOptions.selectAcceptTask : selectOptions.initialAcceptTask;
    values.files = files;

    onSave(
        onSaveOptions.url, values, onSaveOptions.setLoadingSave, onSaveOptions.actionCreatorEdit,
        onSaveOptions.actionCreatorCreate, onSaveOptions.dataStore, onSaveOptions.onRemove, onSaveOptions.specKey, onSaveOptions.rowData
    ).then(async () => {
        const date = store.getState().reducerLogDO.date;

        const data = await request("/api/log-do/" + date);

        if (data) {
            store.dispatch(ActionCreator.ActionCreatorLogDO.getAllLogDO(data));
        }
    });
};

// Функция, добавлюящая доп. функционал при сохранении записи в разделе "Оборудование"
const onSaveHOCEquipment = (values, files, selectOptions, onSaveOptions) => {
    // Находим и переприсваиваем equipmentProperty
    // values.properties.forEach(select => {
    //     let foundEquipmentProperty = selectOptions.equipmentProperties.find(property => {
    //         return property._id === select.equipmentProperty || property.name === select.equipmentProperty;
    //     });
    //
    //     if (foundEquipmentProperty) {
    //         select.equipmentProperty = foundEquipmentProperty;
    //     }
    // });

    // Фильтруем неподходящие значения поля equipmentProperty
    values.properties = values.properties.filter(select => {
        return select.equipmentProperty !== "Не выбрано" && select.equipmentProperty;
    });
    values.parent = selectOptions.selectEquipment === "Не выбрано" ? null : selectOptions.selectEquipment ?
                selectOptions.selectEquipment : selectOptions.initialEquipment;
    values.files = files;

    onSave(onSaveOptions.url, values, onSaveOptions.setLoadingSave, onSaveOptions.actionCreatorEdit,
        onSaveOptions.actionCreatorCreate, onSaveOptions.dataStore, onSaveOptions.onRemove, onSaveOptions.specKey,
        onSaveOptions.rowData).then(null);
};

// Функция, добавлюящая доп. функционал при удалении записи
const onDeleteHOC = async (setLoadingDelete, model, onDeleteOptions) => {
    try {
        setLoadingDelete(true);
        const data = await request("/files/delete/" + onDeleteOptions.rowData._id, "DELETE", {model});

        if (data) {
            onDelete(
                onDeleteOptions.url, onDeleteOptions.setLoadingDelete, onDeleteOptions.actionCreatorDelete,
                onDeleteOptions.dataStore, onDeleteOptions.onRemove, onDeleteOptions.specKey, onDeleteOptions.rowData,
                onDeleteOptions.setVisiblePopConfirm
            ).then(null);
        }
    } catch (e) {
        message.error("Возникла ошибка при удалении файлов записи, пожалуйста, удалите файлы вручную");
    }
};

// Функция, добавлюящая доп. функционал при нажатии на кнопку "Отмена"
const onCancelHOC = async (setLoadingCancel, onCancelOptions) => {
    try {
        setLoadingCancel(true);

        const data = await request("/files/cancel", "DELETE");

        if (data) {
            setLoadingCancel(false);
            onCancel(onCancelOptions.onRemove, onCancelOptions.specKey);
        }
    } catch (e) {
        message.error("Возникла ошибка при удалении файлов записи, пожалуйста, удалите файлы вручную");
    }
};

// Функция, добавлюящая доп. функционал при изменении значений выпадающих списков
const onChangeHOC = (form, value, data, dataStore, setSelect) => {
    const map = new Map([
        [dataStore.departments, setSelect.setSelectDep],
        [dataStore.people, setSelect.setSelectPeople],
        [dataStore.equipment, setSelect.setSelectEquipment],
        [dataStore.responsible, setSelect.setSelectResponsible],
        [dataStore.tasks, setSelect.setSelectState],
        [dataStore.acceptTask, setSelect.setSelectAcceptTask],
    ]);

    let select;

    if (map.has(data)) {
        select = map.get(data);
    }

    if (data === "responsible" || data === "acceptTask") {
        data = dataStore.people;
    }

    onChange(form, value, select, data);
};

// Функция, добавлюящая доп. функционал при загрузке данных в выпадающие списки
const onDropDownRenderHOC = (open, data, dataStore, setLoading, setOptions) => {
    const map = new Map([
        [dataStore.departments, {
            setLoading: setLoading.setLoadingSelectDep,
            key: "departments",
            dispatchAction: ActionCreator.ActionCreatorDepartment.getAllDepartments,
            setSelectToOptions: setOptions.setDepartmentsToOptions
        }],
        [dataStore.people, {
            setLoading: setLoading.setLoadingSelectPeople,
            key: "people",
            dispatchAction: ActionCreator.ActionCreatorPerson.getAllPeople,
            setSelectToOptions: setOptions.setPeopleToOptions
        }],
        [dataStore.equipment, {
            setLoading: setLoading.setLoadingSelectEquipment,
            key: "equipment",
            dispatchAction: ActionCreator.ActionCreatorEquipment.getAllEquipment,
            setSelectToOptions: setOptions.setEquipmentToOptions
        }],
        [dataStore.responsible, {
            setLoading: setLoading.setLoadingSelectResponsible,
            key: "people",
            dispatchAction: ActionCreator.ActionCreatorPerson.getAllPeople,
            setSelectToOptions: setOptions.setResponsibleToOptions
        }],
        [dataStore.tasks, {
            setLoading: setLoading.setLoadingSelectState,
            key: "taskStatus",
            dispatchAction: ActionCreator.ActionCreatorTask.getAllTasks,
            setSelectToOptions: setOptions.setStateToOptions
        }],
        [dataStore.acceptTask, {
            setLoading: setLoading.setLoadingSelectAcceptTask,
            key: "people",
            dispatchAction: ActionCreator.ActionCreatorPerson.getAllPeople,
            setSelectToOptions: setOptions.setAcceptTaskToOptions
        }],
    ]);

    let dropDownObject;

    if (map.has(data)) {
        dropDownObject = map.get(data);
    }

    onDropDownRender(open, dropDownObject.setLoading, dropDownObject.key, dropDownObject.dispatchAction, dropDownObject.setSelectToOptions)
        .then(null);
};

export const HOCFunctions = {
    onSave: { onSaveHOCLogDO, onSaveHOCEquipment },
    onDelete: onDeleteHOC,
    onCancel: onCancelHOC,
    onChange: onChangeHOC,
    onDropDownRender: onDropDownRenderHOC,
};