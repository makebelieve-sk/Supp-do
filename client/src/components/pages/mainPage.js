import React, {useState, useEffect, useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Layout, Menu, Button, Tabs, message, Row, Col, Modal, Dropdown, Avatar} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    LaptopOutlined,
    QuestionCircleOutlined,
    DownOutlined,
} from '@ant-design/icons';

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";
import {AuthContext} from "../../context/authContext";
import {OpenSectionContentHelper} from "../helpers/sectionContentMap.helper";
import logo from '../../assets/logo.png';

const {Header, Sider, Content, Footer} = Layout;
const {SubMenu} = Menu;
const {TabPane} = Tabs;

export const MainPage = () => {
    // Получаем текущие табы из хранилища
    const {tabs, prevActiveTab} = useSelector(state => ({
        tabs: state.tabs,
        prevActiveTab: state.prevActiveTab
    }));
    const dispatch = useDispatch();

    // Получение контекста авторизации (токен, id пользователя, пользователь, функции входа/выхода, флаг авторизации)
    const auth = useContext(AuthContext);

    // Установка начальной активной вкладки
    let startKey = tabs && tabs.length > 0 ? tabs[0].key : null;

    // Создание стейтов для скрытия/раскрытия боковой панели, активной вкладки и показа модального окна
    const [collapsed, setCollapsed] = useState(true);
    const [activeKey, setActiveKey] = useState(startKey);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Функция показа модального окна
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Функция закрытия модального окна
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Получение функции создания запросов на сервер, состояний загрузки и ошибки
    const {request, error, loading} = useHttp();

    // Загрузка всех профессий, подразделений и персонала
    useEffect(() => {
        async function getProfessions() {
            try {
                const professions = await request('/api/directory/professions');

                if (professions && professions.length > 0) {
                    dispatch(ActionCreator.getAllProfessions(professions));
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
    const add = (title, content, key, tabs, row) => {
        let tabObject = {title, content, key, row};
        let index = -1;

        tabs.forEach((tab, i) => {
            if (tab.key === key) {
                index = i;
            }
        })

        if (index >= 0) {
            dispatch(ActionCreator.editTab(index, tabObject));
            setActiveKey(key);
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

    // Компонент выпадающего списка действия с учетной записью пользователя
    const dropdownMenu = <Menu>
        <Menu.Item key="changePassword">Сменить пароль</Menu.Item>
        <Menu.Item key="logout" onClick={() => {
            auth.logout();
        }}>Выйти</Menu.Item>
    </Menu>;

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} width={300}>
                <div className="logo">
                    <img src={logo} alt="Лого" className="logo-image" />
                    {collapsed ? null : 'СУПП ДО'}
                </div>
                <Menu theme="dark" mode="inline">
                    <SubMenu key="directory" icon={<UserOutlined/>} title="Справочники">
                        <SubMenu title="Управление персоналом">
                            <Menu.Item key="profession"
                                       onClick={() => OpenSectionContentHelper('professions', add, request, tabs)}
                            >Профессии</Menu.Item>
                            <Menu.Item key="departments"
                                       onClick={() => OpenSectionContentHelper('departments', add, request, tabs)}
                            >Подразделения</Menu.Item>
                            <Menu.Item key="people"
                                       onClick={() => OpenSectionContentHelper('people', add, request, tabs)}
                            >Персонал</Menu.Item>
                        </SubMenu>
                        <SubMenu title="Оборудование">
                            <Menu.Item key="characteristics"
                                       onClick={() => OpenSectionContentHelper('testData', add, request, tabs)}
                            >Характеристики оборудования</Menu.Item>
                            <Menu.Item key="list">Перечень оборудования</Menu.Item>
                            <Menu.Item key="tasks"
                                       onClick={() => OpenSectionContentHelper('tasks', add, request, tabs)}
                            >Состояние заявок</Menu.Item>
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
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background header-component">
                    <div>
                        <Button type="primary" onClick={toggleCollapsed} style={{marginLeft: 15}}>
                            {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        </Button>
                    </div>
                    <div className="logo">СУПП ДО</div>
                    <div className="user">
                        <Dropdown overlay={dropdownMenu} trigger={['click']}>
                            <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                                <Avatar>{auth.user ? auth.user.login[0] : 'U'}</Avatar> {auth.user ? auth.user.login : ''} <DownOutlined />
                            </a>
                        </Dropdown>
                    </div>
                </Header>
                <Content className="site-layout-background content-component">
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
                                        loadingData={loading}
                                        tabData={tab.row}
                                    />}
                                </TabPane>
                            ))}
                        </Tabs> :
                        <div style={{textAlign: 'center', padding: 10}}>Нет открытых вкладок</div>}
                </Content>
                <Footer>
                    <Row>
                        <Col span={18} className="footer_text">
                            Система управления производственным процессом. Дефекты и отказы. 2020. Версия 1.0.0
                        </Col>
                        <Col span={6}>
                            <p onClick={showModal} className="footer_text cursor">
                                <QuestionCircleOutlined /> Помощь
                            </p>
                            <Modal
                                title="Помощь"
                                visible={isModalVisible}
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