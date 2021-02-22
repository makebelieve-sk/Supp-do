import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {message, Popconfirm, Upload} from 'antd';
import {CloudDownloadOutlined, DeleteOutlined, InboxOutlined, QuestionCircleOutlined} from "@ant-design/icons";

import {request} from "../../helpers/request.helper";

const {Dragger} = Upload;

export const UploadComponent = ({files, model, rowData, actionCreatorAdd, actionCreatorDelete}) => {
    const dispatch = useDispatch();

    let duplicateFile = null;

    // Инициализация стейта показа спиннера при удалении файла из списак файлов
    const [loadingDeleteFile, setLoadingDeleteFile] = useState(false);

    // Удаление файла с диска и из redux
    const removeFile = async (deletedFile) => {
        setLoadingDeleteFile(true);

        let findFile = files.find(file => {
            return JSON.stringify(file) === JSON.stringify(deletedFile);
        });

        let indexOf = files.indexOf(findFile);

        if (findFile && indexOf >= 0) {
            dispatch(actionCreatorDelete(indexOf));

            const id = rowData ? rowData._id : -1;

            try {
                const objectToServer = {
                    model: model,
                    _id: deletedFile._id,
                    uid: deletedFile.uid,
                    url: deletedFile.url
                };
                const data = await request("/files/delete-file/" + id, "DELETE", objectToServer);

                if (data) {
                    message.success(data.message);
                }
            } catch (e) {
                message.error("Возникла ошибка при удалении файла " + deletedFile.name);
            }
        } else {
            message.error(`Файл ${deletedFile.name} не найден`);
        }

        setLoadingDeleteFile(false);
    };

    // Настройки компонента "Upload"
    const props = {
        name: 'file',
        multiple: true,
        action: "/files/upload",
        data: (file) => {
            console.log(file.uid)
            return {
                id: rowData ? rowData._id : -1,
                originUid: file.uid,
                model: model,
                uid: file.uid
            }
        },
        defaultFileList: files,
        fileList: files,
        showUploadList: {
            showDownloadIcon: true,
            downloadIcon: <CloudDownloadOutlined/>,
            showRemoveIcon: true,
            removeIcon: (file) => {
                return <Popconfirm
                    title="Вы уверены, что хотите удалить файл?"
                    okText="Удалить"
                    onConfirm={() => removeFile(file)}
                    okButtonProps={{loading: loadingDeleteFile}}
                    icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                >
                    <DeleteOutlined/>
                </Popconfirm>
            }
        },
        beforeUpload(file) {
            duplicateFile = files.find(currentFile => {
                return file.name === currentFile.name;
            });

            if (duplicateFile) {
                message.warning("Такой файл уже существует в этой записи").then(null);
            }
        },
        onChange(info) {
            const {status} = info.file;

            if (status === 'done') {
                message.success(`Файл ${info.file.name} успешно загружен.`).then(null);
            } else if (status === 'error') {
                message.error(`Возникла ошибка при загрузке файла ${info.file.name}.`).then(r => console.log(r));
            }

            if (duplicateFile) {
                info.fileList.splice(info.fileList.length - 1, 1);
            }

            console.log(info.file.uid)
            const newFileList = {
                originUid: info.file.uid,
                name: info.file.name,
                url: `public/${model}/${info.file.uid}-${info.file.name}`,
                status: "done",
                uid: `-1-${info.file.name}`
            };

            dispatch(actionCreatorAdd(newFileList));
        },
        async onRemove(file) {
            return new Promise((resolve, reject) => {
                return <Popconfirm
                    onConfirm={() => {
                        resolve(true);
                        removeFile(file);
                    }}
                    onCancel={() => {
                        reject(true);
                    }}
                >
                    <DeleteOutlined/>
                </Popconfirm>
            });
        }
    };

    return <Dragger {...props}>
        <p className="ant-upload-drag-icon">
            <InboxOutlined/>
        </p>
        <p className="ant-upload-text">Щелкните или перетащите файл
            в эту область, чтобы загрузить</p>
        <p className="ant-upload-hint">
            Поддержка одиночной или массовой загрузки.
        </p>
    </Dragger>
}