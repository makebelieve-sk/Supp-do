// Компонент ContentComponent, отвечающий за показ вкладок и их содержимого
import React from "react";
import {Tabs} from "antd";

import {ActionCreator} from "../../redux/combineActions";
import {useDispatch, useSelector} from "react-redux";

const {TabPane} = Tabs;

export const ContentComponent = () => {
    // Получаем вкладки из хранилища(текущие, активную и последнюю)
    const {tabs, activeKey, prevActiveTab} = useSelector(state => state.reducerTab);
    const dispatch = useDispatch();

    // Функция удаления вкладки
    const onRemove = (targetKey, action) => {
        if (action === "remove") {
            let index = 0;
            let lastIndex = -1;

            tabs.forEach((pane, i) => {
                if (pane.key === targetKey) {
                    index = i;
                }
                if (prevActiveTab && pane.key === prevActiveTab) {
                    lastIndex = i;
                }
            });

            const panes = tabs.filter(pane => pane.key !== targetKey);

            if (panes.length && activeKey === targetKey) {
                if (panes[lastIndex] && lastIndex >= 0) {
                    dispatch(ActionCreator.ActionCreatorTab.setActiveKey(panes[lastIndex].key));
                } else {
                    dispatch(ActionCreator.ActionCreatorTab.setActiveKey(panes[0].key));
                }
            }

            dispatch(ActionCreator.ActionCreatorTab.removeTab(index));
        }
    };

    // Изменяем активную вкладку
    const onChange = activeKey => dispatch(ActionCreator.ActionCreatorTab.setActiveKey(activeKey));

    return tabs && tabs.length > 0 ?
        <Tabs
            hideAdd
            onChange={onChange}
            activeKey={activeKey}
            type="editable-card"
            onEdit={onRemove}
        >
            {tabs.map(tab => (
                <TabPane tab={tab.title} key={tab.key}>
                    {<tab.content specKey={tab.key} onRemove={onRemove}/>}
                </TabPane>
            ))}
        </Tabs> :
        <div style={{textAlign: "center", padding: 10}}>Нет открытых вкладок</div>
}