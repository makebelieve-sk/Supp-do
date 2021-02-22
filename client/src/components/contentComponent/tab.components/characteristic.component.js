// Компонент "Характеристики оборудования"
import React from "react";
import {useDispatch} from "react-redux";
import {ActionCreator} from "../../../redux/combineActions";
import {Button, Col, Form, Input, Row, Select} from "antd";
import {DeleteOutlined} from "@ant-design/icons";

export const CharacteristicComponent = ({
    selectsArray, equipmentPropertyToOptions, dropDownRenderHandlerProperty, loadingSelectCharacteristics
}) => {
    const dispatch = useDispatch();

    // Добавление строки во вкладке "Характеристики"
    const addRowProperty = (index) => {
        if (index === selectsArray.length - 1) {
            dispatch(ActionCreator.ActionCreatorEquipment.addSelectRow({
                equipmentProperty: "Не выбрано",
                value: "",
                id: Math.random()
            }));
        }
    };

    // Удаление строки во вкладке "Характеристики"
    const deleteRowProperty = (index) => {
        if (selectsArray.length === 1) {
            return null;
        }

        dispatch(ActionCreator.ActionCreatorEquipment.deleteSelectRow(index));
    };

    // Изменение строки во вкладке "Характеристики"
    const changeRowPropertyHandler = (value, index) => {
        let selectRow;

        selectRow = value === "Не выбрано" ?
            {
                equipmentProperty: null,
                value: null,
                id: selectsArray[index].id
            } :
            {
                equipmentProperty: value,
                value: selectsArray[index].value,
                id: selectsArray[index].id
            }

        dispatch(ActionCreator.ActionCreatorEquipment.editSelectRow(selectRow, index));
    }

    return selectsArray && selectsArray.length ?
        selectsArray.map((label, index) => (
            <Form.Item
                key={`${label.equipmentProperty}-${label.id}`}
                wrapperCol={{span: 24}}
            >
                <Row gutter={8}>
                    <Col span={11}>
                        <Form.Item
                            name={`label-${label.equipmentProperty}-${label.id}`}
                            noStyle
                            initialValue={label.equipmentProperty === "Не выбрано" ?
                                "Не выбрано" : label.equipmentProperty ? label.equipmentProperty.name ?
                                    label.equipmentProperty.name : label.equipmentProperty : "Не выбрано"}
                        >
                            <Select
                                onClick={() => addRowProperty(index)}
                                options={equipmentPropertyToOptions}
                                onDropdownVisibleChange={dropDownRenderHandlerProperty}
                                loading={loadingSelectCharacteristics}
                                onChange={(value) => changeRowPropertyHandler(value, index)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item
                            name={`value-${label.value}1-${label.id}`}
                            initialValue={label.value}
                        >
                            <Input
                                onClick={() => addRowProperty(index)}
                                maxLength={255}
                                type="text"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Button
                            onClick={() => deleteRowProperty(index)}
                            icon={<DeleteOutlined/>}
                            type="danger"
                        />
                    </Col>
                </Row>
            </Form.Item>
        )) : "Список характеристик пуст";
};