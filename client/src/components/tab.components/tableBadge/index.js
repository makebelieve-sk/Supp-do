// Компонент легенды статусов
import React from "react";
import {Badge, Col, Row} from "antd";

import "./tableBadge.css";

export const TableBadgeComponent = ({legend, specKey}) => {
    return legend && specKey === "logDO"
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
                    />
                </Col>
            ))}
        </Row>
        : null
}