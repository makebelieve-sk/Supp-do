// Компонент отрисовывающий подвал приложения
import React, {useState, useEffect} from "react";
import {Col, Layout, Modal, Row} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import ReactHtmlParser from "react-html-parser";

import store from "../../../redux/store";
import {HelpRoute} from "../../../routes/route.Help";
import {getHelpTitle} from "../../../helpers/mappers/tabs.mappers/table.helper";
import ErrorIndicator from "../errorIndicator/errorIndicator.component";
import {useWindowWidth} from "../../../hooks/windowWidth.hook";

import "./footer.css";

export const FooterComponent = () => {
    // Состояние для показа модального окна, содержимого помощи и режима работы приложения
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [help, setHelp] = useState({title: "", text: ""});
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        const mode = JSON.parse(localStorage.getItem("mode"));

        if (mode && mode === "demo") setIsDemo(true);
    }, []);

    // Функция получения объекта помощи раздела
    const getHelp = async () => {
        try {
            // Получаем объект помощи раздела
            const currentKey = store.getState().reducerTab.activeKey;

            const item = await HelpRoute.getHelpToModal(currentKey);
            setIsModalVisible(true);    // Открываем модальное окно

            const title = getHelpTitle(currentKey);

            // Устанавливаем объект помощи в состояние
            item
                ? setHelp({title, text: <div>{ReactHtmlParser(item.text)}</div>})
                : setHelp({title, text: "В данном разделе текст помощи отсутствует"});
        } catch (e) {
            setHelp({title: "", text: <ErrorIndicator error={e}/>});
        }
    };

    const screen = useWindowWidth();    // Получаем текущее значение ширины окна браузера

    // Получение контента кнопки в зависимости от ширины экрана
    const getContent = (content) => screen !== "xs" && screen !== "sm" && screen !== "md" ? content : null;

    return (
        <Layout.Footer className="layout-footer">
            <Row align="middle">
                <Col span={18} className="footer-text">
                    Система управления производственным процессом. Дефекты и отказы. 2021. Версия 1.0.0 {isDemo ? "(Демоверсия)" : null}
                </Col>

                <Col span={6} onClick={getHelp} className="footer-text cursor">
                    <QuestionCircleOutlined/> {getContent("Помощь")}
                </Col>

                <Modal
                    title={"Помощь раздела " + help.title}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    cancelText="Закрыть"
                    width="60%"
                >
                    {help.text}
                </Modal>
            </Row>
        </Layout.Footer>
    );
};