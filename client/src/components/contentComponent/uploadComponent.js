import React from "react";
import {Upload} from 'antd';
import {InboxOutlined} from "@ant-design/icons";

const {Dragger} = Upload;

export const UploadComponent = ({props}) => <Dragger {...props}>
    <p className="ant-upload-drag-icon">
        <InboxOutlined/>
    </p>
    <p className="ant-upload-text">Щелкните или перетащите файл
        в эту область, чтобы загрузить</p>
    <p className="ant-upload-hint">
        Поддержка одиночной или массовой загрузки.
    </p>
</Dragger>