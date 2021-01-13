import React, {useState} from 'react';
import {Layout, Menu, Button, Tabs} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
} from '@ant-design/icons';

import './header.css';

const {Header, Sider, Content} = Layout;
const { SubMenu } = Menu;
const { TabPane } = Tabs;

export const HeaderComponent = () => {
    // Табы
    const panes = [
        { title: 'Профессии', content: 'Profession tab', key: '1' },
    ];

    const [collapsed, setCollapsed] = useState(false);
    const [ activeKey, setActiveKey ] = useState(panes[0].key);
    const [ tabs, setTabs ] = useState(panes);

    // Функция открытия/закрытия боковой панели
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    // Функция изменения активного таба
    const onChange = activeKey => {
        setActiveKey(activeKey);
    };

    // Фукнция удаления таба
    const onRemove = (targetKey, action) => {
        console.log(action)
        if (action === 'remove') {
            let lastIndex;

            tabs.forEach((pane, i) => {
                if (pane.key === targetKey) {
                    lastIndex = i - 1;
                }
            });

            const panes = tabs.filter(pane => pane.key !== targetKey);

            if (panes.length && activeKey === targetKey) {
                if (lastIndex >= 0) {
                    setActiveKey(panes[lastIndex].key);
                } else {
                    setActiveKey(panes[0].key);
                }
            }

            setTabs(panes);
        }
    };

    const add = (name, content) => {
        let activeKey = name;
        console.log(tabs);
        tabs.push({ title: name, content, key: activeKey });
        setActiveKey(activeKey);
        setTabs(tabs);
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} width={300}>
                <div className="logo">
                    {collapsed ?
                        null
                        : 'СУПП ДО'}
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <SubMenu key="directory" icon={<UserOutlined />} title="Справочники">
                        <SubMenu title="Управление персоналом">
                            <Menu.Item key="profession" onClick={() => {
                                add('Профессии', 'Profession tab');
                            }}>Профессии</Menu.Item>
                            <Menu.Item key="department">Подразделения</Menu.Item>
                            <Menu.Item key="person">Персонал</Menu.Item>
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
                    <SubMenu key="admin" icon={<LaptopOutlined />} title="Администрирование">
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
                    <SubMenu key="user" icon={<NotificationOutlined />} title="Пользователь">
                        <Menu.Item key="changePassword">Сменить пароль</Menu.Item>
                        <Menu.Item key="logout">Выйти</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 0, height: 64}}>
                    <div style={{width: '100%', heigth: 64, lineHeigth: 64}}>
                        <Button type="primary" onClick={toggleCollapsed} style={{marginLeft: 15}}>
                            {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        </Button>
                    </div>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <Tabs
                        hideAdd
                        onChange={onChange}
                        activeKey={activeKey}
                        type="editable-card"
                        onEdit={onRemove}
                    >
                        {tabs.map(pane => (
                            <TabPane tab={pane.title} key={pane.key}>
                                {pane.content}
                            </TabPane>
                        ))}
                    </Tabs>
                </Content>
            </Layout>
        </Layout>
    );
}