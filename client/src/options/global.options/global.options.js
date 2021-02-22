// Глобальные настройки приложения
import {LaptopOutlined, UserOutlined} from "@ant-design/icons";
import {ActionCreator} from "../../redux/combineActions";
import {Card, Skeleton, Tabs} from "antd";
import {TableComponent} from "../../components/contentComponent/table.components/tableComponent";
import {TreeComponent} from "../../components/contentComponent/table.components/treeComponent";

const {TabPane} = Tabs;

// Инициализация меню приложения
const menuItems = [
    {
        title: "Справочники",
        key: "directory",
        icon: <UserOutlined/>,
        children: [
            {
                title: "Управление персоналом",
                key: "personManagement",
                children: [
                    {
                        title: "Профессии",
                        key: "professions",
                        url: "professions",
                        dispatchAction: ActionCreator.ActionCreatorProfession.getAllProfessions
                    },
                    {
                        title: "Подразделения",
                        key: "departments",
                        url: "departments",
                        dispatchAction: ActionCreator.ActionCreatorDepartment.getAllDepartments
                    },
                    {
                        title: "Персонал",
                        key: "people",
                        url: "people",
                        dispatchAction: ActionCreator.ActionCreatorPerson.getAllPeople
                    }
                ]
            },
            {
                title: "Оборудование",
                key: "equipmentKey",
                children: [
                    {
                        title: "Оборудование",
                        key: "equipmentProperties",
                        url: "equipment-property",
                        dispatchAction: ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties
                    },
                    {
                        title: "Перечень оборудования",
                        key: "equipment",
                        url: "equipment",
                        dispatchAction: ActionCreator.ActionCreatorEquipment.getAllEquipment
                    },
                    {
                        title: "Состояние заявок",
                        key: "tasks",
                        url: "taskStatus",
                        dispatchAction: ActionCreator.ActionCreatorTask.getAllTasks
                    }
                ]
            },
            {
                title: "Прочее",
                key: "other",
                children: [
                    {
                        title: "Информация о предприятии",
                        key: "companyInfo",
                        url: "company-info",
                        dispatchAction: ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties
                    }
                ]
            }
        ]
    },
    {
        title: "Администрирование",
        key: "admin",
        icon: <LaptopOutlined/>,
        children: [
            {
                title: "Общее",
                key: "general",
                children: [
                    {
                        title: "Страницы приложения",
                        key: "pages",
                        url: "pages",
                        dispatchAction: ActionCreator.ActionCreatorProfession.getAllProfessions
                    },
                    {
                        title: "Помощь",
                        key: "help",
                        url: "help",
                        dispatchAction: ActionCreator.ActionCreatorDepartment.getAllDepartments
                    }
                ]
            },
            {
                title: "Управление пользователями",
                key: "userManagement",
                children: [
                    {
                        title: "Пользователи",
                        key: "users",
                        url: "users",
                        dispatchAction: ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties
                    },
                    {
                        title: "Роли",
                        key: "roles",
                        url: "roles",
                        dispatchAction: ActionCreator.ActionCreatorEquipment.getAllEquipment
                    },
                    {
                        title: "Журнал действий пользователя",
                        key: "actions",
                        url: "actions",
                        dispatchAction: ActionCreator.ActionCreatorTask.getAllTasks
                    }
                ]
            }
        ]
    }
];

// Отображение контента для обычных вкладок
const tabContent = (loadingSkeleton, key) => <div className="container-dto">
    <Skeleton loading={loadingSkeleton} active>
        <Card className="card-dto">
            <TableComponent specKey={key}/>
        </Card>
    </Skeleton>
</div>;

// Отображение контента для вкладки "Подразделение"
const departmentsContent = (loadingSkeleton, key, dataStore) => <div className="container-dto">
    <Skeleton loading={loadingSkeleton} active>
        <Card className="card-dto">
            <Tabs defaultActiveKey="table">
                <TabPane tab="Таблица" key="table">
                    <TableComponent specKey={key}/>
                </TabPane>
                <TabPane tab="Дерево" key="tree">
                    <TreeComponent dataStore={dataStore}/>
                </TabPane>
            </Tabs>
        </Card>
    </Skeleton>
</div>;

// Отображение контента для вкладки "Оборудование"
const equipmentContent = (loadingSkeleton, key, dataStore) => <div className="container-dto">
    <Skeleton loading={loadingSkeleton} active>
        <Card className="card-dto">
            <Tabs defaultActiveKey="table">
                <TabPane tab="Таблица" key="table">
                    <TableComponent specKey={key}/>
                </TabPane>
                <TabPane tab="Дерево" key="tree">
                    <TreeComponent dataStore={dataStore}/>
                </TabPane>
            </Tabs>
        </Card>
    </Skeleton>
</div>;

export {menuItems, tabContent, departmentsContent, equipmentContent};