// Компонент, возвращающий запись раздела ""Оборудование" для печати
import React from "react";

export default class PrintEquipment extends React.Component {
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
                            <h2>Оборудование</h2>
                            <h3>Главное</h3>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Принадлежит:</p>
                                <p><b>{record.parent ? record.parent.name : ""}</b></p>
                            </div>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Наименование:</p>
                                <p><b>{record.name}</b></p>
                            </div>

                            <div style={{display: "flex", width: "50%", justifyContent: "space-between"}}>
                                <p>Описание:</p>
                                <p><b>{record.notes}</b></p>
                            </div>

                            <h3>Характеристики</h3>

                            {record.properties && record.properties.length ?
                                record.properties.map((characteristic, index) => {
                                    return (
                                        <div
                                            key={`${characteristic.equipmentProperty}-${index}`}
                                            style={{display: "flex", width: "50%", justifyContent: "space-between"}}
                                        >
                                            <p>{characteristic.equipmentProperty
                                                ? characteristic.equipmentProperty.name : ""}:</p>

                                            <p><b>{characteristic.value ? characteristic.value : ""}</b></p>
                                        </div>
                                    )
                                }) : null}
                        </div> : null
                }
            </>
        )
    }
}