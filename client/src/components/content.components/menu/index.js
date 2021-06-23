// Компонент, отрисовывающий меню
import React, {useContext} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {Menu} from "antd";
import {LaptopOutlined, MenuUnfoldOutlined, StockOutlined, UserOutlined} from "@ant-design/icons";

import {ProfileTab} from "../../../tabs/profile";
import {ProfileRoute} from "../../../routes/route.Profile";
import {AuthContext} from "../../../context/auth.context";
import OpenTableTab from "../../../helpers/functions/tabs.functions/openTableTab";
import openRecord from "../../../helpers/functions/tabs.functions/openRecordTab";
import {checkRoleUser} from "../../../helpers/mappers/general.mappers/checkRoleUser";
import {sectionKeys} from "../../../options";

import {AnalyticRoute} from "../../../routes/route.Analytic";
import {StatisticRatingRoute} from "../../../routes/route.StatisticRating";
import {ProfessionRoute} from "../../../routes/route.profession";
import {DepartmentRoute} from "../../../routes/route.Department";
import {PersonRoute} from "../../../routes/route.Person";
import {EquipmentPropertyRoute} from "../../../routes/route.EquipmentProperty";
import {EquipmentRoute} from "../../../routes/route.Equipment";
import {TaskStatusRoute} from "../../../routes/route.taskStatus";
import {UserRoute} from "../../../routes/route.User";
import {RoleRoute} from "../../../routes/route.Role";
import {LogRoute} from "../../../routes/route.Log";
import {HelpRoute} from "../../../routes/route.Help";

import {ProfessionSection} from "../../../sections/professionSection";
import {DepartmentSection} from "../../../sections/departmentSection";
import {PersonSection} from "../../../sections/personSection";
import {EquipmentPropertySection} from "../../../sections/equipmentPropertySection";
import {EquipmentSection} from "../../../sections/equipmentSection";
import {TaskStatusSection} from "../../../sections/taskStatusSection";
import {HelpSection} from "../../../sections/helpSection";
import {UserSection} from "../../../sections/userSection";
import {RoleSection} from "../../../sections/roleSection";
import {LogSection} from "../../../sections/logSection";
import {AnalyticComponent} from "../../../tabs/analytic";
import {StatisticComponent} from "../../../tabs/statistic";

import "./menu.css";

export const MenuComponent = ({mode}) => {
    // Получение объекта пользователя и бокового меню приложения
    const user = useSelector(state => state.reducerAuth.user);

    let menu = [
        {
            title: "Аналитика",
            key: "analytic-section",
            icon: <StockOutlined/>,
            children: [
                {
                    title: "Аналитика",
                    key: sectionKeys.analytic,
                    model: AnalyticRoute,
                    section: AnalyticComponent
                },
                {
                    title: "Статистика",
                    key: sectionKeys.statistic,
                    model: StatisticRatingRoute,
                    section: StatisticComponent
                }
            ]
        },
        {
            title: "Справочники",
            key: "directory",
            icon: <MenuUnfoldOutlined/>,
            children: [
                {
                    title: "Управление персоналом",
                    key: "personManagement",
                    children: [
                        {
                            title: "Профессии",
                            key: sectionKeys.professions,
                            model: ProfessionRoute,
                            section: ProfessionSection
                        },
                        {
                            title: "Подразделения",
                            key: sectionKeys.departments,
                            model: DepartmentRoute,
                            section: DepartmentSection
                        },
                        {
                            title: "Персонал",
                            key: sectionKeys.people,
                            model: PersonRoute,
                            section: PersonSection
                        }
                    ]
                },
                {
                    title: "Оборудование",
                    key: "equipmentKey",
                    children: [
                        {
                            title: "Характеристики оборудования",
                            key: sectionKeys.equipmentProperties,
                            model: EquipmentPropertyRoute,
                            section: EquipmentPropertySection
                        },
                        {
                            title: "Перечень оборудования",
                            key: sectionKeys.equipment,
                            model: EquipmentRoute,
                            section: EquipmentSection
                        },
                        {
                            title: "Состояние заявок",
                            key: sectionKeys.tasks,
                            model: TaskStatusRoute,
                            section: TaskStatusSection
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
                    title: "Управление пользователями",
                    key: "userManagement",
                    children: [
                        {
                            title: "Пользователи",
                            key: sectionKeys.users,
                            model: UserRoute,
                            section: UserSection
                        },
                        {
                            title: "Роли",
                            key: sectionKeys.roles,
                            model: RoleRoute,
                            section: RoleSection
                        },
                        {
                            title: "Журнал действий пользователя",
                            key: sectionKeys.logs,
                            model: LogRoute,
                            section: LogSection
                        }
                    ]
                },
                {
                    title: "Помощь",
                    key: sectionKeys.help,
                    model: HelpRoute,
                    section: HelpSection
                }
            ]
        }
    ];  // Инициализация главного меню проекта

    // Получение контекста авторизации (токен, id пользователя, пользователь, функции входа/выхода, флаг авторизации)
    const auth = useContext(AuthContext);

    // Формируем боковое меню согласно правам пользователя
    if (user) {
        menu = menu.filter(group => {
            if (group.children && group.children.length) {
                const data = checkRoleUser(group.key, user);

                if (data && !data.read) {
                    const indexOfMenu = menu.indexOf(group);

                    if (indexOfMenu >= 0) {
                        return false;
                    }
                }

                group.children = group.children.filter(subgroup => {
                    if (subgroup.children && subgroup.children.length) {
                        const data = checkRoleUser(subgroup.key, user);

                        if (data && !data.read) {
                            const indexOfGroup = group.children.indexOf(subgroup);

                            if (indexOfGroup >= 0) {
                                return false;
                            }
                        }

                        subgroup.children = subgroup.children.filter(item => {
                            const data = checkRoleUser(item.key, user);

                            if (data && !data.read) {
                                const indexOfItem = subgroup.children.indexOf(item);

                                if (indexOfItem >= 0) {
                                    return false;
                                }
                            }

                            return true;
                        });

                        if (!subgroup.children.length) {
                            subgroup.children = null;
                            return false;
                        }

                        return true;
                    } else {
                        const data = checkRoleUser(subgroup.key, user);

                        if (!data || !data.read) {
                            const indexOfSubgroup = group.children.indexOf(subgroup);

                            if (indexOfSubgroup >= 0) {
                                return false;
                            }
                        }

                        return true;
                    }
                });

                if (!group.children.length) {
                    group.children = null;
                    return false;
                }

                return true;
            }

            return false;
        });

        if (!menu.length) {
            menu = null;
        }
    }

    // Обработка клика на "Настройки пользователя"
    const onProfileClick = () => {
        openRecord(user._id, "Профиль", "Профиль", ProfileTab, "profile", ProfileRoute);
    };

    return (
        <>
            {/*Основное меню приложения*/}
            <Menu theme="dark" mode={mode}>
                {
                    menu && menu.length
                        ? menu.map(group => {
                            return group.children && group.children.length
                                ? <Menu.SubMenu key={group.key} icon={group.icon} title={group.title}>
                                    {
                                        group.children.map(subgroup => {
                                            if (subgroup.children && subgroup.children.length) {
                                                return <Menu.SubMenu title={subgroup.title} key={subgroup.key}>
                                                    {
                                                        subgroup.children.map(item => {
                                                            return <Menu.Item key={item.key} onClick={() =>
                                                                OpenTableTab(item.title, item.key, item.model, item.section)}
                                                            >
                                                                {item.title}
                                                            </Menu.Item>
                                                        })
                                                    }
                                                </Menu.SubMenu>
                                            } else {
                                                return <Menu.Item key={subgroup.key} onClick={() =>
                                                    OpenTableTab(subgroup.title, subgroup.key, subgroup.model, subgroup.section)}
                                                >
                                                    {subgroup.title}
                                                </Menu.Item>
                                            }
                                        })
                                    }
                                </Menu.SubMenu>
                                : null
                        })
                        : null
                }
            </Menu>

            {/*Отдельное меню пользователя*/}
            <Menu theme="dark" mode={mode}>
                <Menu.SubMenu title={user && user.userName ? user.userName : ""} key="personal-area"
                              icon={<UserOutlined/>}>
                    <Menu.Item key="profile" onClick={onProfileClick}>
                        Настройки профиля
                    </Menu.Item>

                    <Menu.Item key="logout">
                        <Link to="/login" onClick={auth.logout}>
                            Выйти
                        </Link>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        </>
    );
};