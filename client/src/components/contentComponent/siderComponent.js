// Компонент SiderComponent, отвечающий за боковое меню
import React from "react";
import {Layout, Menu} from "antd";

import {ActionCreator} from "../../redux/combineActions";
import {LogDORoute} from "../../routes/route.LogDO";
import OpenTableTab from "../helpers/tab.helpers/openTableTab";
import {menuItems} from "../../options/global.options/global.options";

import logo from "../../assets/logo.png";

const {SubMenu} = Menu;

export const SiderComponent = ({collapsed}) => {
    return (
        <Layout.Sider trigger={null} collapsible collapsed={collapsed} width={300}>
            <div className="logo">
                <img
                    src={logo}
                    alt="Лого"
                    className="logo-image"
                    onClick={() => OpenTableTab(
                        "Журнал дефектов и отказов",
                        "logDO",
                        "log-do",
                        ActionCreator.ActionCreatorLogDO.getAllLogDO,
                        LogDORoute
                    )}
                />

                {collapsed ? null : "СУПП ДО"}
            </div>

            <Menu theme="dark" mode="inline">
                {
                    menuItems.map(group => (
                        <SubMenu key={group.key} icon={group.icon} title={group.title}>
                            {
                                group.children.map(subgroup => (
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
                                    </SubMenu>
                                ))
                            }
                        </SubMenu>
                    ))
                }
            </Menu>
        </Layout.Sider>
    )
};