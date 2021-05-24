// Компонент, отрисовывающий верхнее меню или кнопку раскрытия бокового меню
import React from "react";
import {Button, Layout} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";

import {MenuComponent} from "../index";

import "./topMenu.css";

export const TopMenu = ({left, collapsed, setCollapsed}) => {
    const component = left
        ? <div>
            <Button type="primary" onClick={() => setCollapsed(!collapsed)} className="collapse-left-menu-btn">
                {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
            </Button>
        </div>
        : <MenuComponent collapsed={collapsed} mode="horizontal" />

    return (
        <Layout.Header className="site-layout-background header-component">
            {component}
        </Layout.Header>
    );
};