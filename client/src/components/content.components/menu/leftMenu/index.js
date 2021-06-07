// Компонент, отрисовывающий боковое меню
import React from "react";
import {Layout} from "antd";

import {MenuComponent} from "../index";
import {LogoComponent} from "../../logo";

export const LeftMenu = ({left, collapsed}) => {
    return left
        ? <Layout.Sider trigger={null} collapsible collapsed={collapsed} width={300}>
            <LogoComponent collapsed={collapsed} />
            <MenuComponent mode="inline" />
        </Layout.Sider>
        : null;
};