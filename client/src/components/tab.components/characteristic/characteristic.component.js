// Компонент "Характеристики оборудования"
import React, {useMemo} from "react";
import {Button, Col, Form, Input, Row, Select, Tooltip} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";

import {openRecordTab} from "../../../helpers/mappers/tabs.mappers/table.helper";

import "./characteristic.css";
import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import {checkRoleUser} from "../../../helpers/mappers/general.mappers/checkRoleUser";

export const CharacteristicComponent = ({equipmentPropertyToOptions, dropdownRender, loadingSelectCharacteristics, setLoadingSelectCharacteristics, setEquipmentPropertyToOptions, form, user}) => {
    // Добавление строки во вкладке "Характеристики"
    const addRowProperty = (index, add, fields) => {
        if (index === fields.length - 1) {
            add();
        }
    };

    return useMemo(() => (
        <Form.List name="properties">
            { (fields, {add, remove}) => {
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
                                            initialValue={null}
                                        >
                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                onClick={() => addRowProperty(index, add, fields)}
                                                options={equipmentPropertyToOptions}
                                                onDropdownVisibleChange={open => dropdownRender(open, setLoadingSelectCharacteristics, setEquipmentPropertyToOptions, "equipmentProperty")}
                                                loading={loadingSelectCharacteristics}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={{span: 6}} sm={{span: 6}} md={{span: 4}} lg={{span: 4}} xl={{span: 4}}>
                                        <Form.Item label=" ">
                                            {
                                                checkRoleUser("equipmentProperties", user).edit
                                                    ? <Button
                                                        className="button-add-select"
                                                        onClick={() => {
                                                            store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldEquipmentProperty({
                                                                key: "equipmentEquipmentProperty",
                                                                formValues: form.getFieldsValue(true),
                                                                index
                                                            }));

                                                            openRecordTab("equipmentProperties", "-1");
                                                        }}
                                                        icon={<PlusOutlined/>}
                                                        type="secondary"
                                                        disabled={true}
                                                    />
                                                    : <Tooltip title="У вас нет прав" color="#ff7875">
                                                        <Button
                                                            className="button-add-select"
                                                            onClick={() => {
                                                                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldEquipmentProperty({
                                                                    key: "equipmentEquipmentProperty",
                                                                    formValues: form.getFieldsValue(true),
                                                                    index
                                                                }));

                                                                openRecordTab("equipmentProperties", "-1");
                                                            }}
                                                            icon={<PlusOutlined/>}
                                                            type="secondary"
                                                            disabled={true}
                                                        />
                                                    </Tooltip>
                                            }
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
                                    initialValue=""
                                >
                                    <Input onClick={() => addRowProperty(index, add, fields)} maxLength={255} type="text"/>
                                </Form.Item>
                            </Col>

                            <Col span={2}>
                                <Form.Item label=" ">
                                    <Button className="characteristic_button" onClick={() => remove(field.name)} icon={<DeleteOutlined/>} type="danger"/>
                                </Form.Item>
                            </Col>
                        </Row>
                    ))}
                </>
            }}
        </Form.List>
    ), [equipmentPropertyToOptions, dropdownRender, loadingSelectCharacteristics, setEquipmentPropertyToOptions, setLoadingSelectCharacteristics, form, user])
}