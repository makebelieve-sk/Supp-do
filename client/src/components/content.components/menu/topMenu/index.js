// Компонент, отрисовывающий верхнее меню или кнопку раскрытия бокового меню
import React from "react";
import {Button, Layout} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";

import {MenuComponent} from "../index";
import {LogoComponent} from "../../logo";

import "./topMenu.css";

export const TopMenu = ({left, collapsed, setCollapsed}) => {
    const component = left
        ? <div>
            <Button type="primary" onClick={() => setCollapsed(!collapsed)} className="collapse-left-menu-btn">
                {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
            </Button>
        </div>
        : <>
            <LogoComponent collapsed={collapsed} />

            <div className="header-component">
                <MenuComponent mode="horizontal" />
            </div>
        </>

    return (
        <Layout.Header className="site-layout-background flex">
            {component}
        </Layout.Header>
    );
};