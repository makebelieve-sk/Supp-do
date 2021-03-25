// Компонент SiderComponent, отвечающий за боковое меню
import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {Layout, Menu} from "antd";

import {ActionCreator} from "../../../redux/combineActions";
import {LogDORoute} from "../../../routes/route.LogDO";
import {AuthContext} from "../../../context/auth.context";
import OpenTableTab from "../../../helpers/functions/tabs.functions/openTableTab";
import {menuItems} from "../../../options/global.options/global.options";

import logo from "../../../assets/logo.png";
import "./sider.css";

const {SubMenu} = Menu;

export const SiderComponent = ({collapsed}) => {
    // Получение контекста авторизации (токен, id пользователя, пользователь, функции входа/выхода, флаг авторизации)
    const auth = useContext(AuthContext);

    return (
        <Layout.Sider trigger={null} collapsible collapsed={collapsed} width={300}>
            <div className="logo" onClick={() => OpenTableTab(
                "Журнал дефектов и отказов",
                "logDO",
                "log-do",
                ActionCreator.ActionCreatorLogDO.getAllLogDO,
                LogDORoute
            )}>
                <img src={logo} alt="Лого" className="logo-image"/>

                {collapsed ? null : "СУПП ДО"}
            </div>

            <Menu theme="dark" mode="inline">
                {
                    menuItems.map(group => (
                        <SubMenu key={group.key} icon={group.icon} title={group.title}>
                            {
                                group.children.map(subgroup => (
                                    subgroup.children && subgroup.children.length ?
                                        <SubMenu title={subgroup.title} key={subgroup.key}>
                                            {
                                                subgroup.children.map(item => (
                                                    <Menu.Item
                                                        key={item.key}
                                                        onClick={() => OpenTableTab(
                                                            item.title,
                                                            item.key,
                                                            item.url,
                                                            item.dispatchAction,
                                                            item.model
                                                        )}
                                                    >{item.title}</Menu.Item>
                                                ))
                                            }
                                        </SubMenu> :
                                        <Menu.Item key={subgroup.key}>
                                            <Link to={subgroup.url} onClick={() => {
                                                subgroup.key === "logout" ? auth.logout() : alert("Смена пароля");
                                            }}>
                                                {subgroup.title}
                                            </Link>
                                        </Menu.Item>
                                ))
                            }
                        </SubMenu>
                    ))
                }
            </Menu>
        </Layout.Sider>
    )
};