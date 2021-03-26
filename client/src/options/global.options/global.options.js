// Глобальные настройки приложения
import React from "react";
import {MenuUnfoldOutlined, LaptopOutlined, UserOutlined} from "@ant-design/icons";
import {ActionCreator} from "../../redux/combineActions";

import {ProfessionRoute} from "../../routes/route.profession";
import {DepartmentRoute} from "../../routes/route.Department";
import {PersonRoute} from "../../routes/route.Person";
import {EquipmentPropertyRoute} from "../../routes/route.EquipmentProperty";
import {EquipmentRoute} from "../../routes/route.Equipment";
import {TaskStatusRoute} from "../../routes/route.taskStatus";

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
            {
                title: "Прочее",
                key: "other",
                children: [
                    {
                        title: "Информация о предприятии",
                        key: "companyInfo",
                        url: "company-info",
                        dispatchAction: ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties
                    }
                ]
            }
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
                        dispatchAction: ActionCreator.ActionCreatorDepartment.getAllDepartments
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
                        dispatchAction: ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties
                    },
                    {
                        title: "Роли",
                        key: "roles",
                        url: "roles",
                        dispatchAction: ActionCreator.ActionCreatorEquipment.getAllEquipment
                    },
                    {
                        title: "Журнал действий пользователя",
                        key: "actions",
                        url: "actions",
                        dispatchAction: ActionCreator.ActionCreatorTask.getAllTasks
                    }
                ]
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
    }
];

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
            key !== "equipmentId";
    });
}

export {menuItems, getFilteredData, getPrintFilteredData};