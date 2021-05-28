// Главная страница
import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {Layout} from "antd";

import {LogDORoute} from "../routes/route.LogDO";
import {ContentComponent} from "../components/content.components/content/content.component";
import {FooterComponent} from "../components/content.components/footer";
import {LeftMenu} from "../components/content.components/menu/leftMenu";
import {TopMenu} from "../components/content.components/menu/topMenu";

export const MainPage = () => {
    // Получение объекта пользователя
    const user = useSelector(state => state.reducerAuth.user);

    // Создание состояний для скрытия/раскрытия боковой панели
    const [collapsed, setCollapsed] = useState(true);

    // Загрузка записей раздела "Журнал дефектов и отказов"
    useEffect(() => {
        (async () => await LogDORoute.getAll())();
    }, []);

    return (
        <Layout>
            {/*Компонент, отрисовывающий боковое меню*/}
            <LeftMenu left={user && user.typeMenu && user.typeMenu.length && user.typeMenu[0].value === "left"} collapsed={collapsed} />

            <Layout style={{backgroundColor: "#fff"}}>
                {/*Компонент, отрисовывающий верхнее меню или кнопку раскрытия бокового меню*/}
                <TopMenu
                    left={user && user.typeMenu && user.typeMenu.length && user.typeMenu[0].value === "left"}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />

                {/*Компонент, отрисовывающий вкладки и их содержимое*/}
                <ContentComponent/>

                {/*Компонент, отрисовывающий подвал приложения*/}
                <FooterComponent />
            </Layout>
        </Layout>
    );
};