// Компонент, возвращающий запись раздела "Журнал дефектов и отказов" для печати
import React from "react";
import {CheckOutlined} from "@ant-design/icons";

export default class PrintLogDO extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.record !== nextProps.record;
    }

    render() {
        const {record} = this.props;

        return (
            <>
                {
                    record ?
                        <div style={{padding: 20}}>
                            <h2>Печать записи из журнала дефектов и отказов</h2>
                            <h3>Главное</h3>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Дата заявки:</p>
                                <p><b>{record.date}</b></p>
                            </div>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Заявитель:</p>
                                <p><b>{record.applicant ? record.applicant.name : ""}</b></p>
                            </div>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Объект:</p>
                                <p><b>{record.equipment ? record.equipment.name : ""}</b></p>
                            </div>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Описание:</p>
                                <p><b>{record.notes}</b></p>
                            </div>

                            <h3>Выполнение</h3>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Подразделение:</p>
                                <p><b>{record.department ? record.department.name : ""}</b></p>
                            </div>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Ответственный:</p>
                                <p><b>{record.responsible ? record.responsible.name : ""}</b></p>
                            </div>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Задание:</p>
                                <p><b>{record.task}</b></p>
                            </div>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Состояние:</p>
                                <p><b>{record.taskStatus ? record.taskStatus.name : ""}</b></p>
                            </div>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Дата выполнения:</p>
                                <p><b>{record.planDateDone}</b></p>
                            </div>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Содержание работ:</p>
                                <p><b>{record.content}</b></p>
                            </div>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Работу принял:</p>
                                <p><b>{record.acceptTask ? <CheckOutlined/> : ""}</b></p>
                            </div>
                        </div> : null
                }
            </>
        )
    }
}