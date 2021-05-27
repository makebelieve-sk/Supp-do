// Компонент печати раздела "Аналитика"
import React from "react";
import Dashboard from "./dashboard";

export default class PrintAnalytic extends React.Component {
    render() {
        const {data, name} = this.props;

        return (
            <div className="print-wrapper">
                <h3 className="print-title">{name}</h3>

                {/*Компонент, отрисовывающий дашбоард*/}
                <div className="analytic">
                    <Dashboard analytic={data} print={true} />
                </div>
            </div>
        )
    }
}