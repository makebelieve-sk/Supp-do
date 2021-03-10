// Глобальные настройки приложения
import React from "react";
import {LaptopOutlined, UserOutlined} from "@ant-design/icons";
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
        icon: <UserOutlined/>,
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
                title: "Оборудования",
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
    }
];

export {menuItems};