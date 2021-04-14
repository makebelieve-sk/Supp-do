// Создание колонок таблиц
import React from "react";
import {Button, Input, Space, Tooltip} from "antd";
import {CheckOutlined, SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from "moment";
import TabOptions from "../record.options/record.options";

// Создание колонок для раздела "Профессии"
const ProfessionColumns = [
    {
        title: "Наименование",
        dataIndex: "name",
        key: "name",
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Примечание",
        dataIndex: "notes",
        key: "notes",
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ["descend", "ascend"],
    }
];

// Создание колонок для раздела "Подразделения"
const DepartmentColumns = [
    {
        title: "Наименование",
        dataIndex: "name",
        key: "name",
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Примечание",
        dataIndex: "notes",
        key: "notes",
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ["descend", "ascend"],
    }
];

// Создание колонок для раздела "Персонал"
const PersonColumns = [
    {
        title: "ФИО",
        dataIndex: "name",
        key: "name",
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Подразделение",
        dataIndex: "department",
        key: "department",
        width: 100,
        sorter: (a, b) => a.department.length - b.department.length,
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            return {
                children: <Tooltip placement="topLeft" title={record.departmentTooltip}>{text}</Tooltip>,
            };
        }
    },
    {
        title: "Профессия",
        dataIndex: "profession",
        key: "profession",
        width: 100,
        sorter: (a, b) => a.profession.length - b.profession.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Примечание",
        dataIndex: "notes",
        key: "notes",
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ["descend", "ascend"],
    }
];

// Создание колонок для раздела "Состояние заявок"
const TasksColumns = [
    {
        title: "Наименование",
        dataIndex: "name",
        key: "name",
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            return {
                props: {
                    style: {background: record.color},
                },
                children: text,
            };
        },
    },
    {
        title: "Примечание",
        dataIndex: "notes",
        key: "notes",
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            return {
                props: {
                    style: {background: record.color},
                },
                children: text,
            };
        },
    },
    {
        title: "Завершено",
        dataIndex: "isFinish",
        key: "isFinish",
        width: 100,
        sorter: (a, b) => a.isFinish > b.isFinish,
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            let formattedIsFinish = "";

            if (record.isFinish) formattedIsFinish = <CheckOutlined/>;

            return {
                props: {style: {background: record.color}},
                children: formattedIsFinish,
            };
        },
    },
];

// Создание колонок для раздела "Характеристики оборудования"
const EquipmentPropertyColumns = [
    {
        title: "Наименование",
        dataIndex: "name",
        key: "name",
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Примечание",
        dataIndex: "notes",
        key: "notes",
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ["descend", "ascend"],
    }
];

// Создание колонок для раздела "Перечень оборудования"
const EquipmentColumns = [
    {
        title: "Наименование",
        dataIndex: "name",
        key: "name",
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Примечание",
        dataIndex: "notes",
        key: "notes",
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ["descend", "ascend"],
    }
];

// Создание рефов для текстовых полей поиска
const refDate = React.createRef();
const refEquipment = React.createRef();
const refNotes = React.createRef();
const refApplicant = React.createRef();
const refResponsible = React.createRef();
const refDepartment = React.createRef();
const refTask = React.createRef();
const refState = React.createRef();
const refPlanDateDone = React.createRef();
// const refContent = React.createRef();

// Создание колонок для раздела "Журнал дефектов и отказов"
const LogDOColumns = [
    {
        title: "Дата заявки",
        dataIndex: "date",
        key: "date",
        width: 100,
        sorter: (a, b) => {
            const start = moment(a.date, TabOptions.dateFormat);
            const end = moment(b.date, TabOptions.dateFormat);
            
            return start.diff(end, "milliseconds") > 0;
        },
        sortDirections: ["descend", "ascend"],
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={refDate}
                    placeholder="Поиск по дате"
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={confirm}
                    style={{width: 188, marginBottom: 8, display: "block"}}
                />
                <Space>
                    <Button type="primary" onClick={confirm} icon={<SearchOutlined/>} size="small" style={{width: 90}}>
                        Найти
                    </Button>

                    <Button onClick={clearFilters} size="small" style={{width: 90}}>
                        Сбросить
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>,
        onFilter: (value, record) => record["date"].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible =>
            visible ? setTimeout(() => refDate.current.select(), 100) : null,
        render: (text, record) => ({
            props: {style: {background: record.color}},
            children: refDate.current && refDate.current.props.value && refDate.current.props.value.length ?
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[refDate.current.props.value]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                /> : text,
        })
    },
    {
        title: "Оборудование",
        dataIndex: "equipment",
        key: "equipment",
        width: 120,
        sorter: (a, b) => a.equipment.length - b.equipment.length,
        sortDirections: ["descend", "ascend"],
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={refEquipment}
                    placeholder="Поиск по оборудованию"
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={confirm}
                    style={{width: 188, marginBottom: 8, display: "block"}}
                />
                <Space>
                    <Button type="primary" onClick={confirm} icon={<SearchOutlined/>} size="small" style={{width: 90}}>
                        Найти
                    </Button>

                    <Button onClick={clearFilters} size="small" style={{width: 90}}>
                        Сбросить
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>,
        onFilter: (value, record) => record["equipment"].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible =>
            visible ? setTimeout(() => refEquipment.current.select(), 100) : null,
        render: (text, record) => ({
            props: {style: {background: record.color}},
            children: refEquipment.current && refEquipment.current.props.value && refEquipment.current.props.value.length ?
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[refEquipment.current.props.value]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                /> : <Tooltip placement="topLeft" title={record.equipmentTooltip}>{text}</Tooltip>,
        })
    },
    {
        title: "Описание",
        dataIndex: "notes",
        key: "notes",
        width: 250,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ["descend", "ascend"],
        // ellipsis: {showTitle: false},
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={refNotes}
                    placeholder="Поиск по описанию"
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={confirm}
                    style={{width: 188, marginBottom: 8, display: "block"}}
                />
                <Space>
                    <Button type="primary" onClick={confirm} icon={<SearchOutlined/>} size="small" style={{width: 90}}>
                        Найти
                    </Button>

                    <Button onClick={clearFilters} size="small" style={{width: 90}}>
                        Сбросить
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>,
        onFilter: (value, record) => record["notes"].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible =>
            visible ? setTimeout(() => refNotes.current.select(), 100) : null,
        render: (text, record) => ({
            props: {style: {background: record.color}},
            children: refNotes.current && refNotes.current.props.value && refNotes.current.props.value.length ?
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[refNotes.current.props.value]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                /> : text//<Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
        })
    },
    {
        title: "Заявитель",
        dataIndex: "applicant",
        key: "applicant",
        width: 100,
        sorter: (a, b) => a.applicant.length - b.applicant.length,
        sortDirections: ["descend", "ascend"],
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={refApplicant}
                    placeholder="Поиск по заявителям"
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={confirm}
                    style={{width: 188, marginBottom: 8, display: "block"}}
                />
                <Space>
                    <Button type="primary" onClick={confirm} icon={<SearchOutlined/>} size="small" style={{width: 90}}>
                        Найти
                    </Button>

                    <Button onClick={clearFilters} size="small" style={{width: 90}}>
                        Сбросить
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>,
        onFilter: (value, record) => record["applicant"].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible =>
            visible ? setTimeout(() => refApplicant.current.select(), 100) : null,
        render: (text, record) => ({
            props: {style: {background: record.color}},
            children: refApplicant.current && refApplicant.current.props.value && refApplicant.current.props.value.length ?
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[refApplicant.current.props.value]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                /> : text,
        })
    },
    {
        title: "Исполнитель",
        dataIndex: "responsible",
        key: "responsible",
        width: 115,
        sorter: (a, b) => a.responsible.length - b.responsible.length,
        sortDirections: ["descend", "ascend"],
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={refResponsible}
                    placeholder="Поиск по исполнителям"
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={confirm}
                    style={{width: 188, marginBottom: 8, display: "block"}}
                />
                <Space>
                    <Button type="primary" onClick={confirm} icon={<SearchOutlined/>} size="small" style={{width: 90}}>
                        Найти
                    </Button>

                    <Button onClick={clearFilters} size="small" style={{width: 90}}>
                        Сбросить
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>,
        onFilter: (value, record) => record["responsible"].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible =>
            visible ? setTimeout(() => refResponsible.current.select(), 100) : null,
        render: (text, record) => ({
            props: {style: {background: record.color}},
            children: refResponsible.current && refResponsible.current.props.value && refResponsible.current.props.value.length ?
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[refResponsible.current.props.value]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                /> : text,
        })
    },
    {
        title: "Подразделение",
        dataIndex: "department",
        key: "department",
        width: 130,
        sorter: (a, b) => a.department.length - b.department.length,
        sortDirections: ["descend", "ascend"],
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={refDepartment}
                    placeholder="Поиск по подразделениям"
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={confirm}
                    style={{width: 188, marginBottom: 8, display: "block"}}
                />
                <Space>
                    <Button type="primary" onClick={confirm} icon={<SearchOutlined/>} size="small" style={{width: 90}}>
                        Найти
                    </Button>

                    <Button onClick={clearFilters} size="small" style={{width: 90}}>
                        Сбросить
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>,
        onFilter: (value, record) => record["department"].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible =>
            visible ? setTimeout(() => refDepartment.current.select(), 100) : null,
        render: (text, record) => ({
            props: {style: {background: record.color}},
            children: refDepartment.current && refDepartment.current.props.value && refDepartment.current.props.value.length ?
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[refDepartment.current.props.value]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                /> : <Tooltip placement="topLeft" title={record.departmentTooltip}>{text}</Tooltip>,
        })
    },
    {
        title: "Задание",
        dataIndex: "task",
        key: "task",
        width: 180,
        ellipsis: {showTitle: false},
        sorter: (a, b) => a.task.length - b.task.length,
        sortDirections: ["descend", "ascend"],
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={refTask}
                    placeholder="Поиск по заданиям"
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={confirm}
                    style={{width: 188, marginBottom: 8, display: "block"}}
                />
                <Space>
                    <Button type="primary" onClick={confirm} icon={<SearchOutlined/>} size="small" style={{width: 90}}>
                        Найти
                    </Button>

                    <Button onClick={clearFilters} size="small" style={{width: 90}}>
                        Сбросить
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>,
        onFilter: (value, record) => record["task"].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible =>
            visible ? setTimeout(() => refTask.current.select(), 100) : null,
        render: (text, record) => ({
            props: {style: {background: record.color}},
            children: refTask.current && refTask.current.props.value && refTask.current.props.value.length ?
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[refTask.current.props.value]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                /> : <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
        })
    },
    {
        title: "Состояние",
        dataIndex: "state",
        key: "state",
        width: 100,
        sorter: (a, b) => a.state.length - b.state.length,
        sortDirections: ["descend", "ascend"],
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={refState}
                    placeholder="Поиск по состояниям"
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={confirm}
                    style={{width: 188, marginBottom: 8, display: "block"}}
                />
                <Space>
                    <Button type="primary" onClick={confirm} icon={<SearchOutlined/>} size="small" style={{width: 90}}>
                        Найти
                    </Button>

                    <Button onClick={clearFilters} size="small" style={{width: 90}}>
                        Сбросить
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>,
        onFilter: (value, record) => record["state"].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible =>
            visible ? setTimeout(() => refState.current.select(), 100) : null,
        render: (text, record) => ({
            props: {style: {background: record.color}},
            children: refState.current && refState.current.props.value && refState.current.props.value.length ?
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[refState.current.props.value]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                /> : text,
        })
    },
    {
        title: "Плановая дата выполнения",
        dataIndex: "planDateDone",
        key: "planDateDone",
        width: 120,
        sorter: (a, b) => {
            const start = moment(a.planDateDone, TabOptions.dateFormat);
            const end = moment(b.planDateDone, TabOptions.dateFormat);

            return start.diff(end, "milliseconds") > 0;
        },
        sortDirections: ["descend", "ascend"],
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={refPlanDateDone}
                    placeholder="Поиск по планируемой дате выполнения"
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={confirm}
                    style={{width: 188, marginBottom: 8, display: "block"}}
                />
                <Space>
                    <Button type="primary" onClick={confirm} icon={<SearchOutlined/>} size="small" style={{width: 90}}>
                        Найти
                    </Button>

                    <Button onClick={clearFilters} size="small" style={{width: 90}}>
                        Сбросить
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>,
        onFilter: (value, record) => record["planDateDone"].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible =>
            visible ? setTimeout(() => refPlanDateDone.current.select(), 100) : null,
        render: (text, record) => ({
            props: {style: {background: record.color}},
            children: refPlanDateDone.current && refPlanDateDone.current.props.value && refPlanDateDone.current.props.value.length ?
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[refPlanDateDone.current.props.value]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                /> : text,
        })
    },
    // {
    //     title: "Содержание работ",
    //     dataIndex: "content",
    //     key: "content",
    //     width: 145,
    //     ellipsis: {showTitle: false},
    //     sorter: (a, b) => a.content.length - b.content.length,
    //     sortDirections: ["descend", "ascend"],
    //     filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
    //         <div style={{padding: 8}}>
    //             <Input
    //                 ref={refContent}
    //                 placeholder="Поиск по содержаниям работ"
    //                 value={selectedKeys[0]}
    //                 onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
    //                 onPressEnter={confirm}
    //                 style={{width: 188, marginBottom: 8, display: "block"}}
    //             />
    //             <Space>
    //                 <Button type="primary" onClick={confirm} icon={<SearchOutlined/>} size="small" style={{width: 90}}>
    //                     Найти
    //                 </Button>
    //
    //                 <Button onClick={clearFilters} size="small" style={{width: 90}}>
    //                     Сбросить
    //                 </Button>
    //             </Space>
    //         </div>
    //     ),
    //     filterIcon: filtered => <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>,
    //     onFilter: (value, record) => record["content"].toString().toLowerCase().includes(value.toLowerCase()),
    //     onFilterDropdownVisibleChange: visible =>
    //         visible ? setTimeout(() => refContent.current.select(), 100) : null,
    //     render: (text, record) => ({
    //         props: {style: {background: record.color}},
    //         children: refContent.current && refContent.current.props.value && refContent.current.props.value.length ?
    //             <Highlighter
    //                 highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
    //                 searchWords={[refContent.current.props.value]}
    //                 autoEscape
    //                 textToHighlight={text ? text.toString() : ""}
    //             /> : <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
    //     })
    // }
];

// Создание колонок для раздела "Помощь"
const HelpColumns = [
    {
        title: "Название раздела",
        dataIndex: ["name", "label"],
        key: "name",
        width: 100,
        sorter: (a, b) => a.name.label.length - b.name.label.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Текст",
        dataIndex: "text",
        key: "text",
        width: 100,
        sorter: (a, b) => a.text.length - b.text.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Дата изменения",
        dataIndex: "date",
        key: "date",
        width: 100,
        sorter: (a, b) => {
            const start = moment(a.date, TabOptions.dateFormat);
            const end = moment(b.date, TabOptions.dateFormat);

            return start.diff(end, "milliseconds") > 0;
        },
        sortDirections: ["descend", "ascend"],
        render: (text, record) => ({children: moment(record.date).format(TabOptions.dateFormat)})
    }
];

// Создание колонок для раздела "Пользователи"
const UserColumns = [
    {
        title: "Имя пользователя",
        dataIndex: "userName",
        key: "userName",
        width: 100,
        sorter: (a, b) => a.userName.length - b.userName.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Имя",
        dataIndex: "name",
        key: "name",
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Фамилия",
        dataIndex: "surName",
        key: "surName",
        width: 100,
        sorter: (a, b) => a.surName.length - b.surName.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Роли",
        dataIndex: "roles",
        key: "roles",
        width: 100,
        sorter: (a, b) => a.roles.length - b.roles.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Электронная почта",
        dataIndex: "email",
        key: "email",
        width: 100,
        sorter: (a, b) => a.email.length - b.email.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Одобрен",
        dataIndex: "approved",
        key: "approved",
        width: 100,
        render: (text, record) => ({children: record.approved ? <CheckOutlined/> : ""})
    },
];

// Создание колонок для раздела "Роли"
const RoleColumns = [
    {
        title: "Наименование",
        dataIndex: "name",
        key: "name",
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Описание",
        dataIndex: "notes",
        key: "notes",
        width: 100,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ["descend", "ascend"],
    }
];

export {
    ProfessionColumns,
    DepartmentColumns,
    PersonColumns,
    TasksColumns,
    EquipmentPropertyColumns,
    EquipmentColumns,
    LogDOColumns,
    HelpColumns,
    UserColumns,
    RoleColumns,
};