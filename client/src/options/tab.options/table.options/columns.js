// Создание колонок таблиц
import React from "react";
import {Tooltip} from "antd";
import {CheckOutlined} from "@ant-design/icons";

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

// Создание колонок для раздела "Журнал дефектов и отказов"
const LogDOColumns = [
    {
        title: "Дата заявки",
        dataIndex: "date",
        key: "date",
        width: 110,
        sorter: (a, b) => a.date > b.date,
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
        title: "Оборудование",
        dataIndex: "equipment",
        key: "equipment",
        width: 120,
        sorter: (a, b) => a.equipment.length - b.equipment.length,
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            return {
                props: {
                    style: {background: record.color},
                },
                children: <Tooltip placement="topLeft" title={record.equipmentTooltip}>{text}</Tooltip>,
            };
        }
    },
    {
        title: "Описание",
        dataIndex: "notes",
        key: "notes",
        width: 110,
        sorter: (a, b) => a.notes.length - b.notes.length,
        sortDirections: ["descend", "ascend"],
        ellipsis: {showTitle: false},
        render(text, record) {
            return {
                props: {
                    style: {background: record.color},
                },
                children: <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
            };
        },
    },
    {
        title: "Заявитель",
        dataIndex: "applicant",
        key: "applicant",
        width: 100,
        sorter: (a, b) => a.applicant.length - b.applicant.length,
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
        title: "Исполнитель",
        dataIndex: "responsible",
        key: "responsible",
        width: 120,
        sorter: (a, b) => a.responsible.length - b.responsible.length,
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
        title: "Подразделение",
        dataIndex: "department",
        key: "department",
        width: 120,
        sorter: (a, b) => a.department.length - b.department.length,
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            return {
                props: {
                    style: {background: record.color},
                },
                children: <Tooltip placement="topLeft" title={record.departmentTooltip}>{text}</Tooltip>,
            };
        }
    },
    {
        title: "Задание",
        dataIndex: "task",
        key: "task",
        width: 90,
        ellipsis: {showTitle: false},
        sorter: (a, b) => a.task.length - b.task.length,
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            return {
                props: {
                    style: {background: record.color},
                },
                children: <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
            };
        },
    },
    {
        title: "Состояние",
        dataIndex: "state",
        key: "state",
        width: 110,
        sorter: (a, b) => a.state.length - b.state.length,
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
        title: "Планируемая дата выполнения",
        dataIndex: "planDateDone",
        key: "planDateDone",
        width: 120,
        sorter: (a, b) => a.planDateDone.length - b.planDateDone.length,
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
        title: "Дата выполнения",
        dataIndex: "dateDone",
        key: "dateDone",
        width: 120,
        sorter: (a, b) => a.dateDone.length - b.dateDone.length,
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
        title: "Содержание работ",
        dataIndex: "content",
        key: "content",
        width: 140,
        ellipsis: {showTitle: false},
        sorter: (a, b) => a.content.length - b.content.length,
        sortDirections: ["descend", "ascend"],
        render(text, record) {
            return {
                props: {
                    style: {background: record.color},
                },
                children: <Tooltip placement="topLeft" title={text}>
                    {text}
                </Tooltip>,
            };
        },
    }
];

export {
    ProfessionColumns,
    DepartmentColumns,
    PersonColumns,
    TasksColumns,
    EquipmentPropertyColumns,
    EquipmentColumns,
    LogDOColumns
};