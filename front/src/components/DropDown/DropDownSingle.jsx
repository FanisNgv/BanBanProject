import React, { useState, useEffect } from "react";
import Select from "react-select";
const SingleSelect = ({projects, setTempSelected, tempSelected}) => {

    const options = projects.map((project) => ({
        label: project.projectName,
        value: project._id,
    }));

    const handleSelectedUsers = (selectedOptions) => {
        setTempSelected(selectedOptions);
    };

    return (
        <Select
            value={tempSelected}
            onChange={handleSelectedUsers}
            options={options}
        />
    );
};

export default SingleSelect;
