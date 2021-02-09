// Главная страница
import React, {useState, useEffect, useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Layout, Menu, Button, Tabs, Row, Col, Modal, Dropdown, Avatar} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    LaptopOutlined,
    QuestionCircleOutlined,
    DownOutlined,
} from '@ant-design/icons';

import {ActionCreator} from "../../redux/combineActions";

import {AuthContext} from "../../context/authContext";
import {OpenTabSectionHelper} from "../helpers/openTabSection.helper";
import {request} from "../helpers/request.helper";
import logo from '../../assets/logo.png';

const {Header, Sider, Content, Footer} = Layout;
const {SubMenu} = Menu;
const {TabPane} = Tabs;

export const MainPage = () => {
    // Получаем вкладки из хранилища(текущие, активную и последнюю)
    const {tabs, activeKey, prevActiveTab} = useSelector(state => state.reducerTab);
    const dispatch = useDispatch();

    // Получение контекста авторизации (токен, id пользователя, пользователь, функции входа/выхода, флаг авторизации)
    const auth = useContext(AuthContext);

    // Создание стейтов для скрытия/раскрытия боковой панели, активной вкладки и показа модального окна
    const [collapsed, setCollapsed] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Загрузка главного раздела "Журнал дефектов и отказов"
    useEffect(() => {
        async function getProfessions() {
            try {
                const professions = await request('/api/directory/professions');

                if (professions && professions.length > 0) {
                    dispatch(ActionCreator.ActionCreatorProfession.getAllProfessions(professions));
                }
            } catch (e) {}
        }

        getProfessions();
    }, [dispatch]);

    // Фукнция удаления вкладки
    const onRemove = (targetKey, action) => {
        if (action === 'remove') {
            let index = 0;
            let lastIndex = -1;

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
                    dispatch(ActionCreator.ActionCreatorTab.setActiveKey(panes[lastIndex].key));
                } else {
                    dispatch(ActionCreator.ActionCreatorTab.setActiveKey(panes[0].key));
                }
            }

            dispatch(ActionCreator.ActionCreatorTab.removeTab(index));
        }
    };

    // Изменяем активную вкладку
    const onChange = activeKey => {
        dispatch(ActionCreator.ActionCreatorTab.setActiveKey(activeKey));
    };

    // Компонент выпадающего списка, содержит действия для управления учетной записью пользователя
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
                    <img src={logo} alt="Лого" className="logo-image"/>
                    {collapsed ? null : 'СУПП ДО'}
                </div>
                <Menu theme="dark" mode="inline">
                    <SubMenu key="directory" icon={<UserOutlined/>} title="Справочники">
                        <SubMenu title="Управление персоналом">
                            <Menu.Item key="professions"
                                       onClick={() => OpenTabSectionHelper(
                                           'Профессии',
                                           'professions',
                                           'professions',
                                           ActionCreator.ActionCreatorProfession.getAllProfessions
                                       )}
                            >Профессии</Menu.Item>
                            <Menu.Item key="departments"
                                       onClick={() => OpenTabSectionHelper(
                                           'Подразделения',
                                           'departments',
                                           'departments',
                                           ActionCreator.ActionCreatorDepartment.getAllDepartments
                                       )}
                            >Подразделения</Menu.Item>
                            <Menu.Item key="people"
                                       onClick={() => OpenTabSectionHelper(
                                           'Персонал',
                                           'people',
                                           'people',
                                           ActionCreator.ActionCreatorPerson.getAllPeople
                                       )}
                            >Персонал</Menu.Item>
                        </SubMenu>
                        <SubMenu title="Оборудование">
                            <Menu.Item key="equipmentProperties"
                                       onClick={() => OpenTabSectionHelper(
                                           'Характеристики оборудования',
                                           'equipmentProperties',
                                           'equipment-property',
                                           ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties
                                       )}
                            >Характеристики оборудования</Menu.Item>
                            <Menu.Item key="equipment"
                                       onClick={() => OpenTabSectionHelper(
                                           'Перечень оборудования',
                                           'equipment',
                                           'equipment',
                                           ActionCreator.ActionCreatorEquipment.getAllEquipment
                                       )}
                            >Перечень оборудования</Menu.Item>
                            <Menu.Item key="tasks"
                                       onClick={() => OpenTabSectionHelper(
                                           'Состояние заявки',
                                           'tasks',
                                           'taskStatus',
                                           ActionCreator.ActionCreatorTask.getAllTasks
                                       )}
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
                        <Button type="primary" onClick={() => setCollapsed(!collapsed)} style={{marginLeft: 15}}>
                            {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        </Button>
                    </div>
                    <div className="logo">СУПП ДО</div>
                    <div className="user">
                        <Dropdown overlay={dropdownMenu} trigger={['click']}>
                            <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                                <Avatar>{auth.user ? auth.user.login[0] : 'U'} </Avatar> {auth.user ? auth.user.login : ''} <DownOutlined/>
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
                                        specKey={tab.key}
                                        onRemove={onRemove}
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