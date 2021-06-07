// Компонент датапикера
import React from "react";
import {DatePicker} from "antd";

import TabOptions from "../../../options/tab.options/record.options";

import "./rangePicker.css";

export const RangePickerComponent = ({ isVisible, onChange, date }) => {
    return isVisible
        ? <DatePicker.RangePicker
            allowClear={false}
            showTime={{format: "HH:mm"}}
            format={TabOptions.dateFormat}
            onChange={onChange}
            value={date}
            style={{width: "70%"}}
        />
        : null
}