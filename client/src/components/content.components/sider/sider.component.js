// Компонент SiderComponent, отвечающий за боковое меню
import React, {useContext, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {Layout, Menu, message} from "antd";

import {UserRoute} from "../../../routes/route.User";
import {LogDORoute} from "../../../routes/route.LogDO";
import {AuthContext} from "../../../context/auth.context";
import OpenTableTab from "../../../helpers/functions/tabs.functions/openTableTab";
import {checkRoleUser} from "../../../helpers/mappers/general.mappers/checkRoleUser";
import {menuItems} from "../../../options/global.options/global.options";

import logo from "../../../assets/logo.png";
import "./sider.css";

const {SubMenu} = Menu;

export const SiderComponent = ({collapsed}) => {
    const currentUser = useSelector(state => state.reducerAuth.user);  // Получение объекта пользователя

    // Получение контекста авторизации (токен, id пользователя, пользователь, функции входа/выхода, флаг авторизации)
    const auth = useContext(AuthContext);

    // Инициализицазия состояния бокового меню приложения
    const [menu, setMenu] = useState();

    useMemo(() => {
        // Функция получения текущего объекта пользователя
        const getUser = async () => {
            try {
                if (currentUser) {
                    // Обновляем данные о пользователе
                    const user = await UserRoute.getCurrentUser(currentUser._id);

                    return user ? user : null;
                }
            } catch (e) {
                console.log(e);
                message.error("Произошла ошибка при получении объекта пользователя");
            }
        };

        if (currentUser) {
            getUser().then(user => {
                // Делаем копию массива данных для бокового меню приложения
                const menuItemsCopy = menuItems.slice(0);

                // Формируем разделы для пользователя с ролью для просмотра
                const shiftMenu = (i) => {
                    if (i >= 4) return;

                    menuItemsCopy.forEach((group, indexGroup) => {
                        if (group.children && group.children.length) {
                            group.children.forEach((subgroup, indexSubGroup) => {
                                if (subgroup.children && subgroup.children.length) {
                                    subgroup.children.forEach((item, indexItem) => {
                                        const data = checkRoleUser(item.key, user);

                                        if (!data)
                                            menuItemsCopy[indexGroup].children[indexSubGroup].children.splice(indexItem, 1);

                                        if (data && !data.read)
                                            menuItemsCopy[indexGroup].children[indexSubGroup].children.splice(indexItem, 1);
                                    })
                                } else if (!subgroup.url) {
                                    const data = checkRoleUser(subgroup.key, user);

                                    if (!data)
                                        menuItemsCopy[indexGroup].children.splice(indexSubGroup, 1);

                                    if (data && !data.read)
                                        menuItemsCopy[indexGroup].children.splice(indexSubGroup, 1);
                                }
                            })
                        }
                    });

                    shiftMenu(i + 1);
                }

                // Инициализируем флаг для рекурсии
                const i = 0;

                // Вызываем функцию формирования разделов для просмотра
                shiftMenu(i);

                // Обновляем состояние бокового меню
                setMenu(menuItemsCopy);
            });
        }
    }, [currentUser]);

    return (
        <Layout.Sider trigger={null} collapsible collapsed={collapsed} width={300}>
            <div className="logo" onClick={() => OpenTableTab(
                "Журнал дефектов и отказов",
                "logDO",
                LogDORoute
            )}>
                <img src={logo} alt="Лого" className="logo-image"/>

                {collapsed ? null : "СУПП ДО"}
            </div>

            <Menu theme="dark" mode="inline">
                {
                    menu && menu.length
                        ? menu.map(group => {
                            return group.children && group.children.length
                                ? <SubMenu key={group.key} icon={group.icon} title={group.title}>
                                    {
                                        group.children.map(subgroup => {
                                            if (subgroup.children && subgroup.children.length) {
                                                return <SubMenu title={subgroup.title} key={subgroup.key}>
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
                                                </SubMenu>
                                            } else {
                                                if (subgroup.url) {
                                                    return <Menu.Item key={subgroup.key}>
                                                        <Link to={subgroup.url} onClick={() =>
                                                            subgroup.key === "logout" ? auth.logout() : alert("Смена пароля")}
                                                        >
                                                            {subgroup.title}
                                                        </Link>
                                                    </Menu.Item>
                                                } else {
                                                    return <Menu.Item key={subgroup.key} onClick={() =>
                                                        OpenTableTab(subgroup.title, subgroup.key, subgroup.route)}
                                                    >
                                                        {subgroup.title}
                                                    </Menu.Item>
                                                }
                                            }
                                        })
                                    }
                                </SubMenu>
                                : null
                        })
                        : null
                }
            </Menu>
        </Layout.Sider>
    )
};