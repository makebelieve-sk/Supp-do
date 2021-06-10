// Компонент легенды статусов
import React from "react";
import {Badge, Col, Row} from "antd";

import {LogDORoute} from "../../../routes/route.LogDO";
import store from "../../../redux/store";

import "./tableBadge.css";

export const TableBadgeComponent = ({legend, specKey}) => {
    return legend && legend.length && specKey === "logDO"
        ? <Row className="row-badges">
            {legend.map(legend => (
                <Col key={legend.id} className="col-badge">
                    <Badge
                        className="badge"
                        count={`${legend.name} ${legend.count}`}
                        style={{
                            backgroundColor: legend.color,
                            borderColor: legend.borderColor ?  legend.borderColor : null,
                        }}
                        onClick={async () => await LogDORoute.getRecordsWithStatus(
                            store.getState().reducerLogDO.date,
                            typeof legend.id === "number" ? null : legend.id
                        )}
                    />
                </Col>
            ))}
        </Row>
        : null
}