// Глобальные настройки приложения
import {LaptopOutlined, UserOutlined} from "@ant-design/icons";
import {ActionCreator} from "../../redux/combineActions";

import {ProfessionRoute} from "../../routes/route.profession";
import {Departments} from "../../model/Department";
import {People} from "../../model/Person";
import {EquipmentProperty} from "../../model/EquipmentProperty";
import {Equipment} from "../../model/equipment";

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
                        model: Departments
                    },
                    {
                        title: "Персонал",
                        key: "people",
                        url: "people",
                        dispatchAction: ActionCreator.ActionCreatorPerson.getAllPeople,
                        model: People
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
                        model: EquipmentProperty
                    },
                    {
                        title: "Перечень оборудования",
                        key: "equipment",
                        url: "equipment",
                        dispatchAction: ActionCreator.ActionCreatorEquipment.getAllEquipment,
                        model: Equipment
                    },
                    {
                        title: "Состояние заявок",
                        key: "tasks",
                        url: "taskStatus",
                        dispatchAction: ActionCreator.ActionCreatorTask.getAllTasks
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