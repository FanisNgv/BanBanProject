import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MyDatePicker=({startDate, setStartDate}) => {

    let handleColor = (time) => {
        return time.getHours() > 12 ? "text-success" : "text-error";
    };

    return (
        <DatePicker
            showTimeSelect
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            timeClassName={handleColor}
        />
    );
};

export default MyDatePicker;