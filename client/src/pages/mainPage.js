// Главная страница
import React, {useState, useEffect} from "react";
import {Layout, Button, Row, Col, Modal} from "antd";
import {MenuUnfoldOutlined, MenuFoldOutlined, QuestionCircleOutlined} from "@ant-design/icons";

import {LogDORoute} from "../routes/route.LogDO";
import {ContentComponent} from "../components/content.components/content/content.component";
import {SiderComponent} from "../components/content.components/sider/sider.component";
import store from "../redux/store";
import {HelpRoute} from "../routes/route.Help";

const {Header, Content, Footer} = Layout;

export const MainPage = () => {
    // Создание состояний для скрытия/раскрытия боковой панели, активной вкладки, показа модального окна и содержимого помощи
    const [collapsed, setCollapsed] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [help, setHelp] = useState({title: "", text: ""});

    // Загрузка главного раздела "Журнал дефектов и отказов"
    useEffect(() => {
        const getItems = async () => await LogDORoute.getAll();

        getItems().then(null);
    }, []);

    /**
     * Функция получения объекта помощи раздела
     * @returns {Promise<void>} - устанавливает объект помощи в состояние для отображения
     */
    const getHelp = async () => {
        // Получаем объект помощи раздела
        const item = await HelpRoute.getHelpToModal(store.getState().reducerTab.activeKey);
        setIsModalVisible(true);    // Открываем модальное окно

        // Устанавливаем объект помощи в состояние
        item ? setHelp(item) : setHelp({title: "", text: "В данном разделе текст помощи отсутствует"});
    }

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

                        <Col span={6} onClick={getHelp} className="footer_text cursor">
                            <QuestionCircleOutlined/> Помощь
                        </Col>

                        <Modal
                            title={"Помощь раздела " + help.title}
                            visible={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            cancelText="Закрыть"
                        >
                            {help.text}
                        </Modal>
                    </Row>
                </Footer>
            </Layout>
        </Layout>
    );
}