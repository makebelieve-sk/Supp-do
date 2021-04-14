// Глобальные настройки приложения
import React from "react";
import {MenuUnfoldOutlined, LaptopOutlined, UserOutlined, StockOutlined} from "@ant-design/icons";
import {ActionCreator} from "../../redux/combineActions";

import {ProfessionRoute} from "../../routes/route.profession";
import {DepartmentRoute} from "../../routes/route.Department";
import {PersonRoute} from "../../routes/route.Person";
import {EquipmentPropertyRoute} from "../../routes/route.EquipmentProperty";
import {EquipmentRoute} from "../../routes/route.Equipment";
import {TaskStatusRoute} from "../../routes/route.taskStatus";
import {AnalyticRoute} from "../../routes/route.Analytic";
import {StatisticRoute} from "../../routes/route.Statistic";
import {HelpRoute} from "../../routes/route.Help";
import {UserRoute} from "../../routes/route.User";
import {RoleRoute} from "../../routes/route.Role";

// Инициализация меню приложения
const menuItems = [
    {
        title: "Справочники",
        key: "directory",
        icon: <MenuUnfoldOutlined />,
        children: [
            {
                title: "Управление персоналом",
                key: "personManagement",
                children: [
                    {
                        title: "Профессии",
                        key: "professions",
                        url: "professions",
                        dispatchAction: ActionCreator.ActionCreatorProfession.getAllProfessions,
                        model: ProfessionRoute
                    },
                    {
                        title: "Подразделения",
                        key: "departments",
                        url: "departments",
                        dispatchAction: ActionCreator.ActionCreatorDepartment.getAllDepartments,
                        model: DepartmentRoute
                    },
                    {
                        title: "Персонал",
                        key: "people",
                        url: "people",
                        dispatchAction: ActionCreator.ActionCreatorPerson.getAllPeople,
                        model: PersonRoute
                    }
                ]
            },
            {
                title: "Оборудование",
                key: "equipmentKey",
                children: [
                    {
                        title: "Характеристики оборудования",
                        key: "equipmentProperties",
                        url: "equipment-property",
                        dispatchAction: ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties,
                        model: EquipmentPropertyRoute
                    },
                    {
                        title: "Перечень оборудования",
                        key: "equipment",
                        url: "equipment",
                        dispatchAction: ActionCreator.ActionCreatorEquipment.getAllEquipment,
                        model: EquipmentRoute
                    },
                    {
                        title: "Состояние заявок",
                        key: "tasks",
                        url: "taskStatus",
                        dispatchAction: ActionCreator.ActionCreatorTask.getAllTasks,
                        model: TaskStatusRoute
                    }
                ]
            },
        ]
    },
    {
        title: "Администрирование",
        key: "admin",
        icon: <LaptopOutlined/>,
        children: [
            {
                title: "Общее",
                key: "general",
                children: [
                    {
                        title: "Страницы приложения",
                        key: "pages",
                        url: "pages",
                        dispatchAction: ActionCreator.ActionCreatorProfession.getAllProfessions
                    },
                    {
                        title: "Помощь",
                        key: "help",
                        url: "help",
                        dispatchAction: ActionCreator.ActionCreatorHelp.getAllHelp,
                        model: HelpRoute
                    }
                ]
            },
            {
                title: "Управление пользователями",
                key: "userManagement",
                children: [
                    {
                        title: "Пользователи",
                        key: "users",
                        url: "users",
                        dispatchAction: ActionCreator.ActionCreatorUser.getAllUsers,
                        model: UserRoute
                    },
                    {
                        title: "Роли",
                        key: "roles",
                        url: "roles",
                        dispatchAction: ActionCreator.ActionCreatorRole.getAllRoles,
                        model: RoleRoute
                    },
                    {
                        title: "Журнал действий пользователя",
                        key: "logs",
                        url: "logs",
                        // dispatchAction: ActionCreator.ActionCreatorLogs.getAllLogs,
                        // model: LogRoute
                    }
                ]
            }
        ]
    },
    {
        title: "Аналитика",
        key: "analytic",
        icon: <StockOutlined />,
        children: [
            {
                title: "Аналитика",
                key: "analytic",
                url: "analytic",
                dispatchAction: ActionCreator.ActionCreatorAnalytic.getAllAnalytic,
                route: AnalyticRoute
            },
            {
                title: "Статистика",
                key: "statistic",
                url: "statistic",
                dispatchAction: ActionCreator.ActionCreatorStatistic.getAllStatistic,
                route: StatisticRoute
            }
        ]
    },
    {
        title: "Личный кабинет",
        key: "personal-area",
        icon: <UserOutlined/>,
        children: [
            {
                title: "Сменить пароль",
                key: "change-password",
                url: "/change-password"
            },
            {
                title: "Выйти",
                key: "logout",
                url: "/login"
            }
        ]
    },
];

// Инициализация массива существующих разделов проекта
const sections = [
    {label: "Не выбрано", value: null},
    {label: "Профессии", value: "professions"},
    {label: "Подразделения", value: "departments"},
    {label: "Персонал", value: "people"},
    {label: "Характеристики оборудования", value: "equipmentProperties"},
    {label: "Оборудование", value: "equipment"},
    {label: "Состояние заявок", value: "tasks"},
    {label: "Журнал дефектов и отказов", value: "logDO"},
    {label: "Аналитика", value: "analytic"},
    {label: "Статистика", value: "statistic"},
    {label: "Помощь", value: "help"},
    {label: "Пользователи", value: "users"},
    {label: "Роли", value: "roles"},
    {label: "Журнал действий пользователя", value: "logs"},
    {label: "Информация о предприятии", value: "companiesInfo"},
]

/**
 * Функция фильтрации полей массива данных
 * @param data - массив данных
 * @returns массив данных с отфильтрованными полями
 */
const getFilteredData = (data) => {
    return data.filter(key => {
        return key !== "_id" && key !== "key" && key !== "__v" && key !== "files" && key !== "isFinish" &&
            key !== "sendEmail" && key !== "productionCheck" && key !== "downtime" && key !== "acceptTask" &&
            key !== "equipmentTooltip" && key !== "departmentTooltip" && key !== "color" && key !== "departmentId" &&
            key !== "equipmentId";
    });
}

/**
 * Функция фильтрации полей массива данных для печати
 * @param data - массив данных
 * @returns массив данных с отфильтрованными полями
 */
const getPrintFilteredData = (data) => {
    return data.filter(key => {
        return key !== "_id" && key !== "key" && key !== "__v" && key !== "files" &&
            key !== "sendEmail" && key !== "productionCheck" && key !== "downtime" && key !== "acceptTask" &&
            key !== "equipmentTooltip" && key !== "departmentTooltip" && key !== "color" && key !== "departmentId" &&
            key !== "equipmentId" && key !== "parent" && key !== "properties" && key !== "nameWithParent";
    });
}

export {menuItems, sections, getFilteredData, getPrintFilteredData};