// Компонент легенды
import React from "react";
import {Badge, Col, Row} from "antd";

export const TableBadgeComponent = ({legend, specKey}) => {
    return legend && specKey === "logDO"
        ? <Row className="row-badges">
            {legend.map(legend => (
                <Col key={legend.id} className="col-badge">
                    <Badge
                        count={`${legend.name} ${legend.count}`}
                        style={{
                            backgroundColor: legend.color,
                            borderColor: legend.borderColor ?  legend.borderColor : null,
                            color: "black",
                            height: "30px", lineHeight: "30px", paddingLeft: "15px", paddingRight: "15px"
                        }}
                    />
                </Col>
            ))}
        </Row>
        : null
}