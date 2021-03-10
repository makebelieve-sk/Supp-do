// Компонент "Характеристики оборудования"
import React, {useMemo} from "react";
import {Button, Col, Form, Input, Row, Select} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";

import {EquipmentProperty} from "../../../model/EquipmentProperty";
import {openRecordTab} from "../../helpers/table.helpers/table.helper";

export const CharacteristicComponent = ({equipmentPropertyToOptions, dropDownRenderHandler, loadingSelectCharacteristics, setLoadingSelectCharacteristics, equipmentProperties, setEquipmentPropertyToOptions}) => {
    // Добавление строки во вкладке "Характеристики"
    const addRowProperty = (index, add, fields) => {
        if (index === fields.length - 1) {
            add();
        }
    };

    return useMemo(() => (
        <Form.List name="properties">
            { (fields, { add, remove }) => {
                return <>
                    {fields.map((field, index) => (
                        <Row key={field.key} gutter={8}>
                            <Col span={11}>
                                <Row>
                                    <Col xs={{span: 18}} sm={{span: 18}} md={{span: 20}} lg={{span: 20}} xl={{span: 20}}>
                                        <Form.Item
                                            {...field}
                                            isListField={true}
                                            label="Наименование характеристики"
                                            name={[field.name, "equipmentProperty"]}
                                            fieldKey={[field.fieldKey, "equipmentProperty"]}
                                        >
                                            <Select
                                                onClick={() => addRowProperty(index, add, fields)}
                                                options={equipmentPropertyToOptions}
                                                onDropdownVisibleChange={async open => {
                                                    await dropDownRenderHandler(open, setLoadingSelectCharacteristics, EquipmentProperty, setEquipmentPropertyToOptions, equipmentProperties);
                                                }}
                                                loading={loadingSelectCharacteristics}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={{span: 6}} sm={{span: 6}} md={{span: 4}} lg={{span: 4}} xl={{span: 4}}>
                                        <Form.Item label=" ">
                                            <Button
                                                className="button-add-select"
                                                onClick={() => openRecordTab("equipment", "-1")}
                                                icon={<PlusOutlined/>}
                                                type="secondary"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={11}>
                                <Form.Item
                                    {...field}
                                    isListField={true}
                                    label="Значение характеристики"
                                    name={[field.name, "value"]}
                                    fieldKey={[field.fieldKey, "value"]}
                                >
                                    <Input onClick={() => addRowProperty(index, add, fields)} maxLength={255} type="text"/>
                                </Form.Item>
                            </Col>

                            <Col span={2}>
                                <Form.Item label=" ">
                                    <Button style={{width: "100%"}} onClick={() => remove(field.name)} icon={<DeleteOutlined/>} type="danger"/>
                                </Form.Item>
                            </Col>
                        </Row>
                    ))}
                </>
            }}
        </Form.List>
    ), [equipmentPropertyToOptions, dropDownRenderHandler, loadingSelectCharacteristics, equipmentProperties, setEquipmentPropertyToOptions, setLoadingSelectCharacteristics])
}