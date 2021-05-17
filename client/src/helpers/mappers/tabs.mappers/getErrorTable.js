// Определение ошибки раздела
import {message} from "antd";
import {ActionCreator} from "../../../redux/combineActions";

/**
 * Функция определения ошибки раздела
 * @param key - ключ выбранного раздела
 * @param stateObject - объект состояния хранилища
 */
export default function getErrorTable(key, stateObject) {
    // Карта соответствия ключа вкладки и ошибки таблицы
    const map = new Map([
        ["professions", {
            errorText: stateObject.errorProfession,
            action: ActionCreator.ActionCreatorProfession.setErrorTableProfession(null)
        }],
        ["departments", {
            errorText: stateObject.errorDepartment,
            action: ActionCreator.ActionCreatorDepartment.setErrorTableDepartment(null)
        }],
        ["people", {
            errorText: stateObject.errorPerson,
            action: ActionCreator.ActionCreatorPerson.setErrorTablePerson(null)
        }],
        ["tasks", {
            errorText: stateObject.errorTask,
            action: ActionCreator.ActionCreatorTask.setErrorTableTask(null)
        }],
        ["equipmentProperties", {
            errorText: stateObject.errorEquipmentProperty,
            action: ActionCreator.ActionCreatorEquipmentProperty.setErrorTableEquipmentProperty(null)
        }],
        ["equipment", {
            errorText: stateObject.errorEquipment,
            action: ActionCreator.ActionCreatorEquipment.setErrorTableEquipment(null)
        }],
        ["logDO", {
            errorText: stateObject.errorLogDO,
            action: ActionCreator.ActionCreatorLogDO.setErrorTableLogDO(null)
        }],
        ["analytic", {
            errorText: stateObject.errorAnalytic,
            action: ActionCreator.ActionCreatorAnalytic.setErrorAnalytic(null)
        }],
        ["statistic", stateObject.errorRating
            ? {errorText: stateObject.errorRating, action: ActionCreator.ActionCreatorStatistic.setErrorRating(null)}
            : {errorText: stateObject.errorList, action: ActionCreator.ActionCreatorStatistic.setErrorList(null)}
        ],
        ["changePassword", {
            errorText: stateObject.errorChangePassword,
            action: ActionCreator.ActionCreatorChangePassword.setErrorChangePassword(null)
        }],
        ["help", {
            errorText: stateObject.errorHelp,
            action: ActionCreator.ActionCreatorHelp.setErrorTableHelp(null)
        }],
        ["users", {
            errorText: stateObject.errorUser,
            action: ActionCreator.ActionCreatorUser.setErrorTableUser(null)
        }],
        ["roles", {
            errorText: stateObject.errorRole,
            action: ActionCreator.ActionCreatorRole.setErrorTableRole(null)
        }],
        ["logs", {
            errorText: stateObject.errorLog,
            action: ActionCreator.ActionCreatorLog.setErrorTableLog(null)
        }],
    ]);
    
    if (map.has(key)) {
        return map.get(key);
    } else {
        console.log(key);
        message.error(`Раздел с ключём ${key} не существует (определение ошибки раздела)`).then(null);
        return new Error(`Раздел с ключём ${key} не существует (определение ошибки раздела)`);
    }
};