// Главная страница
import React, {useState, useEffect, useContext} from "react";
import {Layout, Menu, Button, Row, Col, Modal, Dropdown, Avatar} from "antd";
import {MenuUnfoldOutlined, MenuFoldOutlined, QuestionCircleOutlined, DownOutlined} from "@ant-design/icons";

import {LogDORoute} from "../../routes/route.LogDO";
import {AuthContext} from "../../context/authContext";
import {ContentComponent} from "../contentComponent/contentComponent";
import {SiderComponent} from "../contentComponent/siderComponent";

const {Header, Content, Footer} = Layout;

export const MainPage = () => {
    // Получение контекста авторизации (токен, id пользователя, пользователь, функции входа/выхода, флаг авторизации)
    const auth = useContext(AuthContext);

    // Создание стейтов для скрытия/раскрытия боковой панели, активной вкладки и показа модального окна
    const [collapsed, setCollapsed] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Загрузка главного раздела "Журнал дефектов и отказов"
    useEffect(() => {
        const getItems = async () => {
            await LogDORoute.getAll();
        }

        getItems().then(null);
    }, []);

    // Компонент выпадающего списка, содержит действия для управления учетной записью пользователя
    const dropdownMenu = <Menu>
        <Menu.Item key="changePassword">Сменить пароль</Menu.Item>
        <Menu.Item key="logout" onClick={() => auth.logout()}>Выйти</Menu.Item>
    </Menu>;

    return (
        <Layout>
            <SiderComponent collapsed={collapsed}/>

            <Layout className="site-layout">
                <Header className="site-layout-background header-component">
                    <div>
                        <Button type="primary" onClick={() => setCollapsed(!collapsed)} style={{marginLeft: 15}}>
                            {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        </Button>
                    </div>
                    <div className="logo">СУПП ДО</div>
                    <div className="user">
                        <Dropdown overlay={dropdownMenu} trigger={["click"]}>
                            <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                                <Avatar>{auth.user ? auth.user.login[0] : "U"}</Avatar> {auth.user ? auth.user.login : ""} <DownOutlined/>
                            </a>
                        </Dropdown>
                    </div>
                </Header>

                <Content className="site-layout-background content-component">
                    <ContentComponent />
                </Content>

                <Footer>
                    <Row>
                        <Col span={18} className="footer_text">
                            Система управления производственным процессом. Дефекты и отказы. 2021. Версия 1.0.0
                        </Col>
                        <Col span={6}>
                            <p onClick={() => setIsModalVisible(true)} className="footer_text cursor">
                                <QuestionCircleOutlined/> Помощь
                            </p>
                            <Modal
                                title="Помощь"
                                visible={isModalVisible}
                                onCancel={() => setIsModalVisible(false)}
                                cancelText="Закрыть"
                            >
                                <p>Помощь!</p>
                            </Modal>
                        </Col>
                    </Row>
                </Footer>
            </Layout>
        </Layout>
    );
}