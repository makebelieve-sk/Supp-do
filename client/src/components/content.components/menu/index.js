// Компонент, отрисовывающий меню
import React, {useContext, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {Menu} from "antd";
import {UserOutlined} from "@ant-design/icons";
import moment from "moment";

import {ProfileTab} from "../../../tabs/profile";
import {LogDORoute} from "../../../routes/route.LogDO";
import {ProfileRoute} from "../../../routes/route.Profile";
import {AuthContext} from "../../../context/auth.context";
import OpenTableTab from "../../../helpers/functions/tabs.functions/openTableTab";
import openRecord from "../../../helpers/functions/tabs.functions/openRecordTab";
import {checkRoleUser} from "../../../helpers/mappers/general.mappers/checkRoleUser";
import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import TabOptions from "../../../options/tab.options/record.options";

import logo from "../../../assets/logo.png";
import "./menu.css";

export const MenuComponent = ({collapsed, mode}) => {
    // Получение объекта пользователя и бокового меню приложения
    const {user, menuItems} = useSelector(state => ({
        user: state.reducerAuth.user,
        menuItems: state.reducerAuth.menuItems
    }));

    // Получение контекста авторизации (токен, id пользователя, пользователь, функции входа/выхода, флаг авторизации)
    const auth = useContext(AuthContext);

    const [menu, setMenu] = useState(); // Состояние бокового меню приложения

    // Формируем боковое меню согласно правам пользователя
    useEffect(() => {
        if (user && menuItems && menuItems.length) {
            // Делаем копию массива данных для бокового меню приложения
            const menuItemsCopy = menuItems.slice(0);

            // Формируем боковое меню согласно правам пользователя
            menuItemsCopy.forEach((group, indexGroup) => {
                if (group.children && group.children.length) {
                    const data = checkRoleUser(group.key, user);

                    if (data && !data.read)
                        menuItemsCopy.splice(indexGroup, 1);

                    group.children.forEach((subgroup, indexSubGroup) => {
                        if (subgroup.children && subgroup.children.length) {
                            const data = checkRoleUser(subgroup.key, user);

                            if (data && !data.read)
                                menuItemsCopy[indexGroup].children.splice(indexSubGroup, 1);

                            subgroup.children.forEach((item, indexItem) => {
                                const data = checkRoleUser(item.key, user);

                                if (data && !data.read)
                                    menuItemsCopy[indexGroup].children[indexSubGroup].children.splice(indexItem, 1);

                                if (data && !data.read && subgroup.children.length === 1)
                                    menuItemsCopy[indexGroup].children[indexSubGroup].children.pop();
                            })
                        } else if (!subgroup.url) {
                            const data = checkRoleUser(subgroup.key, user);

                            if (data && !data.read)
                                menuItemsCopy[indexGroup].children.splice(indexSubGroup, 1);

                            if (data && !data.read && group.children.length === 1)
                                menuItemsCopy[indexGroup].children.pop();
                        }
                    })
                }
            });

            setMenu(menuItemsCopy);
        }
    }, [user, menuItems]);

    return (
        <>
            <div className="logo" onClick={() => {
                // Обновляем датапикер
                store.dispatch(ActionCreator.ActionCreatorLogDO.setDate(
                    moment().startOf("month").format(TabOptions.dateFormat) + "/" +
                    moment().endOf("month").format(TabOptions.dateFormat)
                ));

                OpenTableTab("Журнал дефектов и отказов", "logDO", LogDORoute);
            }}>
                <img src={logo} alt="Лого" className="logo-image"/>

                {collapsed ? null : "СУПП ДО"}
            </div>

            <Menu theme="dark" mode={mode}>
                {
                    menu && menu.length
                        ? menu.map((group, indexGroup) => {
                            if (Array.isArray(group.children) && !group.children.length) {
                                menu.splice(indexGroup, 1);
                                // Обновляем состояние бокового меню
                                setMenu(menu);
                                return null;
                            }
                            return group.children && group.children.length
                                ? <Menu.SubMenu key={group.key} icon={group.icon} title={group.title}>
                                    {
                                        group.children.map((subgroup, subgroupIndex) => {
                                            if (Array.isArray(subgroup.children) && !subgroup.children.length) {
                                                menu[indexGroup].children.splice(subgroupIndex, 1);
                                                // Обновляем состояние бокового меню
                                                setMenu(menu);
                                                return null;
                                            }

                                            if (subgroup.children && subgroup.children.length) {
                                                return <Menu.SubMenu title={subgroup.title} key={subgroup.key}>
                                                    {
                                                        subgroup.children.map(item => {
                                                            return <Menu.Item
                                                                key={item.key}
                                                                onClick={() => OpenTableTab(item.title, item.key, item.model)}
                                                            >
                                                                {item.title}
                                                            </Menu.Item>
                                                        })
                                                    }
                                                </Menu.SubMenu>
                                            } else {
                                                if (subgroup.route) {
                                                    return <Menu.Item key={subgroup.key} onClick={() =>
                                                        OpenTableTab(subgroup.title, subgroup.key, subgroup.route)}
                                                    >
                                                        {subgroup.title}
                                                    </Menu.Item>
                                                } else {
                                                    return <Menu.Item key={subgroup.key} onClick={() =>
                                                        OpenTableTab(subgroup.title, subgroup.key, subgroup.model)}
                                                    >
                                                        {subgroup.title}
                                                    </Menu.Item>
                                                }
                                            }
                                        })
                                    }
                                </Menu.SubMenu>
                                : null
                        })
                        : null
                }

                <Menu.SubMenu title="Личный кабинет" key="personal-area" icon={<UserOutlined/>}>
                    <Menu.Item
                        key="profile"
                        onClick={() => {
                            const user = store.getState().reducerAuth.user;

                            openRecord(
                                user._id,
                                "Профиль",
                                "Профиль",
                                ProfileTab,
                                "profile",
                                ProfileRoute
                            )
                        }}
                    >
                        Настройки профиля
                    </Menu.Item>
                    <Menu.Item
                        key="logout"
                        onClick={() => auth.logout()}
                    >
                        <Link to="/login" onClick={() => auth.logout()}>
                            Выйти
                        </Link>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        </>
    );
};