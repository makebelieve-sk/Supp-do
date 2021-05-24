// Компонент датапикера
import React from "react";
import {DatePicker} from "antd";

import TabOptions from "../../../options/tab.options/record.options";

import "./rangePicker.css";

const {RangePicker} = DatePicker;

export const RangePickerComponent = ({ isVisible, onChange, date }) => {
    return isVisible
        ? <RangePicker
            allowClear={false}
            showTime={{format: "HH:mm"}}
            format={TabOptions.dateFormat}
            onChange={onChange}
            value={date}
            style={{width: "100%"}}
        />
        : null
}