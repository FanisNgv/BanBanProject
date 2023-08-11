import React, { useState, useEffect } from "react";
import Select from "react-select";
const SingleSelectUser = ({projUsers, updateSelectedUsers}) => {
    const[selectedUser, setSelectedUser]= useState();
    const options = projUsers.map((user) => ({
        label: user.firstname+" "+user.lastname,
        value: user._id,
    }));

    const handleSelectedUsers = (selectedOptions) => {
        updateSelectedUsers(selectedOptions);
        setSelectedUser(selectedOptions)
    };

    return (
        <Select
            value={selectedUser}
            onChange={handleSelectedUsers}
            options={options}
        />
    );
};

export default SingleSelectUser;
