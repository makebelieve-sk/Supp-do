// Компонент, отрисовывающий боковое меню
import React from "react";
import {Layout} from "antd";

import {MenuComponent} from "../index";

export const LeftMenu = ({left, collapsed}) => {
    return left
        ? <Layout.Sider trigger={null} collapsible collapsed={collapsed} width={300}>
            <MenuComponent collapsed={collapsed} mode="inline" />
        </Layout.Sider>
        : null;
};