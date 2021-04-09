// Методы модели Журнала дефектов и отказов
import moment from "moment";
import {message} from "antd";

import {LogDoRecord} from "../model/LogDo";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {getParents, getShortNameRecord} from "../helpers/functions/general.functions/replaceField";
import {compareArrays, compareObjects} from "../helpers/functions/general.functions/compare";
import {request} from "../helpers/functions/general.functions/request.helper";
import TabOptions from "../options/tab.options/record.options/record.options";

export const LogDORoute = {
    // Адрес для работы с разделом "Журнал дефектов и отказов"
    base_url: "/api/log-do/",
    // Адрес для работы с файлами
    file_url: "/files/",
    // Получение всех записей
    getAll: async function (date = moment().startOf("month").format(TabOptions.dateFormat)
    + "/" + moment().endOf("month").format(TabOptions.dateFormat)) {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи раздела "Журнал дефектов и отказов"
            const itemsLogDoDto = await request(this.base_url + "dto/" + date);

            // Записываем все записи в хранилище
            if (itemsLogDoDto) {
                const reduxItemsLogDoDto = store.getState().reducerLogDO.logDO;

                const shouldUpdate = compareArrays(itemsLogDoDto.itemsDto, reduxItemsLogDoDto);

                // Обновление легенды статусов
                store.dispatch(ActionCreator.ActionCreatorLogDO.setLegend(itemsLogDoDto.statusLegend));

                if (shouldUpdate) {
                    store.dispatch(ActionCreator.ActionCreatorLogDO.getAllLogDO(itemsLogDoDto.itemsDto));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            message.error("Возникла ошибка при получении записей журнала дефектов и отказов: ", e);
            console.log(e)
        }
    },
    // Получение записи
    get: async function (id) {
        try {
            // Получаем запись
            const item = await request(this.base_url + id);
            const departments = await request("/api/directory/departments/");
            const people = await request("/api/directory/people/");
            const equipment = await request("/api/directory/equipment/");
            const tasks = await request("/api/directory/taskStatus/");

            if (departments && departments.length) {
                const reduxDepartments = store.getState().reducerDepartment.departments;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(departments, reduxDepartments);

                if (shouldUpdate) {
                    departments.forEach(department => {
                        department.nameWithParent = getParents(department, departments) + department.name;
                    });

                    store.dispatch(ActionCreator.ActionCreatorDepartment.getAllDepartments(departments));
                }
            }

            if (people && people.length) {
                const reduxPeople = store.getState().reducerPerson.people;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(people, reduxPeople);

                if (shouldUpdate) {
                    people.forEach(person => {
                        person.name = getShortNameRecord(person.name);
                    });

                    store.dispatch(ActionCreator.ActionCreatorPerson.getAllPeople(people));
                }
            }

            if (equipment && equipment.length) {
                const reduxEquipment = store.getState().reducerEquipment.equipment;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(equipment, reduxEquipment);

                if (shouldUpdate) {
                    equipment.forEach(eq => {
                        eq.nameWithParent = getParents(eq, equipment) + eq.name;
                    });

                    store.dispatch(ActionCreator.ActionCreatorEquipment.getAllEquipment(equipment));
                }
            }

            if (tasks && tasks.length) {
                const reduxTasks = store.getState().reducerTask.tasks;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(tasks, reduxTasks);

                if (shouldUpdate) {
                    store.dispatch(ActionCreator.ActionCreatorTask.getAllTasks(tasks));
                }
            }

            if (item) {
                // Заполняем модель записи
                this.fillItem(item);
            }
        } catch (e) {
            console.log(e)
            message.error("Возникла ошибка при получении записи: ", e);
        }
    },
    // Сохранение записи
    save: async function (item, setLoading, onRemove) {
        try {
            // Устанавливаем метод запроса
            const method = item.isNewItem ? "POST" : "PUT";

            // Получаем сохраненную запись
            const data = await request(this.base_url, method, item);

            if (data) {
                // Выводим сообщение от сервера
                message.success(data.message);

                // Редактирование записи - изменение записи в хранилище redux,
                // Сохранение записи - создание записи в хранилище redux
                if (method === "POST") {
                    store.dispatch(ActionCreator.ActionCreatorLogDO.createLogDO(data.item));
                } else {
                    const logDO = store.getState().reducerLogDO.logDO;
                    const foundLogDO = logDO.find(log => {
                        return log._id === item._id;
                    });
                    const indexLogDO = logDO.indexOf(foundLogDO);

                    if (indexLogDO >= 0 && foundLogDO) {
                        store.dispatch(ActionCreator.ActionCreatorLogDO.editLogDO(indexLogDO, data.item));
                    }
                }
            }

            // Останавливаем спиннер загрузки
            setLoading(false);

            // Удаление текущей вкладки
            onRemove("logDOItem", "remove");

            // Обновляем список записей в таблице по выбранной дате
            const currentDate = store.getState().reducerLogDO.date;
            await this.getAll(currentDate);
        } catch (e) {
            // Останавливаем спиннер загрузки
            setLoading(false);
        }

    },
    // Удаление записи
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm, onRemove) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем файлы
            const fileInfo = await request(this.file_url + "delete/" + _id, "DELETE", {model: "logDO"});

            if (fileInfo) {
                // Удаляем запись
                const data = await request(this.base_url + _id, "DELETE");

                if (data) {
                    // Вывод сообщения
                    message.success(data.message);

                    const logDO = store.getState().reducerLogDO.logDO;

                    // Удаляем запись из хранилища redux
                    let foundLogDO = logDO.find(log => {
                        return log._id === _id;
                    });
                    let indexLogDO = logDO.indexOf(foundLogDO);

                    if (foundLogDO && indexLogDO >= 0) {
                        store.dispatch(ActionCreator.ActionCreatorLogDO.deleteLogDO(indexLogDO));
                    }
                }

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

                // Удаление текущей вкладки
                onRemove("logDOItem", "remove");
            }
        } catch (e) {
            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);
        }
    },
    // Нажатие на кнопку "Отмена"
    cancel: async function (onRemove, setLoadingCancel) {
        try {
            setLoadingCancel(true);

            const fileInfo = await request(this.file_url + "cancel", "DELETE");

            if (fileInfo) {
                setLoadingCancel(false);
                onRemove("logDOItem", "remove");
            }
        } catch (e) {
            message.error("Возникла ошибка при удалении файлов записи, пожалуйста, удалите файлы вручную");
            setLoadingCancel(false);
        }
    },
    // Заполнение модели записи раздела "Журнал дефектов и отказов"
    fillItem: function (item) {
        if (!item) throw new Error("Возникла ошибка при получении записи");

        // Создаем объект записи
        const logDoRecord = new LogDoRecord(item.logDo, item.isNewItem);

        // Получаем запись из редакса
        const reduxLogDoRecord = store.getState().reducerLogDO.rowDataLogDO;

        // Проверяем полученный с сервера объект и объект из редакса на равенство
        const shouldUpdate = compareObjects(logDoRecord, reduxLogDoRecord);

        console.log("Обновление записи ", shouldUpdate)
        // Если объекты не равны, то обновляем запись в редаксе
        if (shouldUpdate) {
            store.dispatch(ActionCreator.ActionCreatorLogDO.setRowDataLogDO(logDoRecord));
            store.dispatch(ActionCreator.ActionCreatorLogDO.getAllFiles(logDoRecord.files));
        }
    }
}