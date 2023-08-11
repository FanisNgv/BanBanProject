import React, { useState, useEffect } from "react";
import Select from "react-select";
const MultiSelectCreateProject = ({users, updateSelectedUsers}) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const options = users.map((user) => ({
        label: user.firstname+" "+user.lastname,
        value: user._id,
    }));
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '10px',
            border: '2px solid red',
            '&:hover': {
                border: '2px solid red',
            },
        }),
    };
    const handleSelectedUsers = (selectedOptions) => {
        setSelectedUsers(selectedOptions);
        updateSelectedUsers(selectedOptions);
    };

    return (
        <Select
            styles={customStyles}
            value={selectedUsers}
            onChange={handleSelectedUsers}
            options={options}
            isMulti
        />
    );
};

export default MultiSelectCreateProject;
