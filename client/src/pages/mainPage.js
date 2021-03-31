// Главная страница
import React, {useState, useEffect} from "react";
import {Layout, Button, Row, Col, Modal} from "antd";
import {MenuUnfoldOutlined, MenuFoldOutlined, QuestionCircleOutlined} from "@ant-design/icons";

import {LogDORoute} from "../routes/route.LogDO";
import {ContentComponent} from "../components/content.components/content/content.component";
import {SiderComponent} from "../components/content.components/sider/sider.component";

const {Header, Content, Footer} = Layout;

export const MainPage = () => {
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

    return (
        <Layout>
            <SiderComponent collapsed={collapsed}/>

            <Layout style={{backgroundColor: "#fff"}}>
                <Header className="site-layout-background header-component">
                    <div>
                        <Button type="primary" onClick={() => setCollapsed(!collapsed)} style={{marginLeft: 15}}>
                            {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        </Button>
                    </div>
                </Header>

                <Content className="content-component">
                    <ContentComponent />
                </Content>

                <Footer style={{backgroundColor: "#F5F5F5"}}>
                    <Row align="middle">
                        <Col span={18} className="footer_text">
                            Система управления производственным процессом. Дефекты и отказы. 2021. Версия 1.0.0
                        </Col>

                        <Col span={6} onClick={() => setIsModalVisible(true)} className="footer_text cursor">
                            <QuestionCircleOutlined/> Помощь
                        </Col>

                        <Modal
                            title="Помощь"
                            visible={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            cancelText="Закрыть"
                        >
                            Помощь!
                        </Modal>
                    </Row>
                </Footer>
            </Layout>
        </Layout>
    );
}