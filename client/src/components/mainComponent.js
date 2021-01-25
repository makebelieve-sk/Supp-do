import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Layout, Menu, Button, Tabs, message, Row, Col, Modal} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined, QuestionCircleOutlined,
} from '@ant-design/icons';

import ActionCreator from "../redux/actionCreators";
import {ContentTab} from "./contentTab";
import {useHttp} from "../hooks/http.hook";

import './mainComponent.css';

const {Header, Sider, Content, Footer} = Layout;
const {SubMenu} = Menu;
const {TabPane} = Tabs;

export const MainComponent = () => {
    // Получаем текущие табы из хранилища
    const {tabs, prevActiveTab} = useSelector(state => ({
        tabs: state.tabs,
        prevActiveTab: state.prevActiveTab
    }));
    const dispatch = useDispatch();

    let startKey = tabs && tabs.length > 0 ? tabs[0].key : null;

    const [collapsed, setCollapsed] = useState(true);
    const [activeKey, setActiveKey] = useState(startKey);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Функции работы модального окна
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const {request, error, loading} = useHttp();

    // Загрузка всех профессий, подразделений и персонала
    useEffect(() => {
        async function getProfessions() {
            try {
                const professions = await request('/api/directory/professions');
                const departments = await request('/api/directory/departments');
                const people = await request('/api/directory/person');

                if (professions && professions.length > 0) {
                    professions.forEach(prof => {
                        dispatch(ActionCreator.pushProfession(prof));
                    });
                }
                if (departments && departments.length > 0) {
                    departments.forEach(department => {
                        dispatch(ActionCreator.pushDepartment(department));
                    });
                }
                if (people && people.length > 0) {
                    people.forEach(person => {
                        dispatch(ActionCreator.pushPerson(person));
                    });
                }
            } catch (e) {}
        }

        getProfessions();

        if (error) {
            message.error(error);
            return null;
        }
    }, [dispatch, error, request]);

    // Функция открытия/закрытия боковой панели
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    // Функция добавления вкладки
    const add = (title, content, key, tabs) => {
        let tabObject = {title, content, key};
        let index = -1;

        tabs.forEach((tab, i) => {
            if (tab.key === key) {
                index = i;
            }
        })

        if (index >= 0) {
            setActiveKey(key);
            return null;
        } else {
            setActiveKey(key);
            dispatch(ActionCreator.addTab(tabObject));
        }

        if (activeKey) {
            dispatch(ActionCreator.setPrevActiveTab(activeKey));
        }
    };

    // Фукнция удаления вкладки
    const onRemove = (targetKey, action) => {
        if (action === 'remove') {
            let index, lastIndex;

            tabs.forEach((pane, i) => {
                if (pane.key === targetKey) {
                    index = i;
                }
                if (prevActiveTab && pane.key === prevActiveTab) {
                    lastIndex = i;
                }
            });

            const panes = tabs.filter(pane => pane.key !== targetKey);
            if (panes.length && activeKey === targetKey) {
                if (panes[lastIndex] && lastIndex >= 0) {
                    setActiveKey(panes[lastIndex].key);
                } else {
                    setActiveKey(panes[0].key);
                }
            }

            dispatch(ActionCreator.removeTab(index));
        }
    };

    // Функция изменения активной вкладки
    const onChange = activeKey => {
        setActiveKey(activeKey);
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} width={300}>
                <div className="logo"></div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <SubMenu key="directory" icon={<UserOutlined/>} title="Справочники">
                        <SubMenu title="Управление персоналом">
                            <Menu.Item key="profession" onClick={() => {
                                add('Профессии', ContentTab, 'profession', tabs);
                            }}>Профессии</Menu.Item>
                            <Menu.Item key="department" onClick={() => {
                                add('Подразделения', ContentTab, 'department', tabs);
                            }}>Подразделения</Menu.Item>
                            <Menu.Item key="person" onClick={() => {
                                add('Персонал', ContentTab, 'person', tabs);
                            }}>Персонал</Menu.Item>
                        </SubMenu>
                        <SubMenu title="Оборудование">
                            <Menu.Item key="characteristics">Характеристики оборудования</Menu.Item>
                            <Menu.Item key="list">Перечень оборудования</Menu.Item>
                            <Menu.Item key="state">Состояние заявок</Menu.Item>
                        </SubMenu>
                        <SubMenu title="Прочее">
                            <Menu.Item key="info">Информация о предприятии</Menu.Item>
                        </SubMenu>
                    </SubMenu>
                    <SubMenu key="admin" icon={<LaptopOutlined/>} title="Администрирование">
                        <SubMenu title="Общее">
                            <Menu.Item key="pages">Страницы приложения</Menu.Item>
                            <Menu.Item key="help">Помощь</Menu.Item>
                        </SubMenu>
                        <SubMenu title="Управление пользователями">
                            <Menu.Item key="users">Пользователи</Menu.Item>
                            <Menu.Item key="roles">Роли</Menu.Item>
                            <Menu.Item key="actions">Журнал действий пользователя</Menu.Item>
                        </SubMenu>
                    </SubMenu>
                    <SubMenu key="user" icon={<NotificationOutlined/>} title="Пользователь">
                        <Menu.Item key="changePassword">Сменить пароль</Menu.Item>
                        <Menu.Item key="logout">Выйти</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{
                    padding: 0,
                    height: 64,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <div style={{width: '100%', heigth: 64, lineHeigth: 64}}>
                        <Button type="primary" onClick={toggleCollapsed} style={{marginLeft: 15}}>
                            {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        </Button>
                    </div>
                    <div className="logo">СУПП ДО</div>
                </Header>
                <Content className="site-layout-background" style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}>
                    {tabs && tabs.length > 0 ?
                        <Tabs
                            hideAdd
                            onChange={onChange}
                            activeKey={activeKey}
                            type="editable-card"
                            onEdit={onRemove}
                        >
                            {tabs.map(tab => (
                                <TabPane tab={tab.title} key={tab.key}>
                                    {<tab.content
                                        add={add}
                                        specKey={tab.key}
                                        onRemove={onRemove}
                                        loading={loading}
                                    />}
                                </TabPane>
                            ))}
                        </Tabs> :
                        <div style={{textAlign: 'center'}}>Нет открытых вкладок</div>}
                </Content>
                <Footer>
                    <Row>
                        <Col span={18} style={{textAlign: 'center'}} className="footer_text">
                            Система управления производственным процессом. Дефекты и отказы. 2020. Версия 1.0.0
                        </Col>
                        <Col span={6}>
                            <p onClick={showModal} className="footer_text cursor">
                                <QuestionCircleOutlined /> Помощь
                            </p>
                            <Modal
                                title="Помощь"
                                visible={isModalVisible}
                                onOk={handleOk}
                                onCancel={handleCancel}
                                cancelText="Закрыть"
                            >
                                <p>Some contents...</p>
                                <p>Some contents...</p>
                                <p>Some contents...</p>
                            </Modal>
                        </Col>
                    </Row>
                </Footer>
            </Layout>
        </Layout>
    );
}