// Компонент "Характеристики оборудования"
import React, {useMemo} from "react";
import {Button, Form, Input, Select, Space} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {EquipmentProperty} from "../../../model/EquipmentProperty";

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
                        <Space key={field.key} align="baseline" style={{width: "100%"}}>
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

                            <Form.Item
                                {...field}
                                isListField={true}
                                label="Значение характеристики"
                                name={[field.name, "value"]}
                                fieldKey={[field.fieldKey, "value"]}
                            >
                                <Input onClick={() => addRowProperty(index, add, fields)} maxLength={255} type="text"/>
                            </Form.Item>

                            <Form.Item label=" ">
                                <Button onClick={() => remove(field.name)} icon={<DeleteOutlined/>} type="danger"/>
                            </Form.Item>
                        </Space>
                    ))}
                </>
            }}
        </Form.List>
    ), [equipmentPropertyToOptions, dropDownRenderHandler, loadingSelectCharacteristics, equipmentProperties, setEquipmentPropertyToOptions, setLoadingSelectCharacteristics])
}