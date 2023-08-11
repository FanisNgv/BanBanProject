import React, { useState, useEffect } from "react";
import Select from "react-select";

const MultiSelect = ({users, projUsers, updateSelectedUsers, defaultUsers, defaultUsersOfProject, selectedUsers, setSelectedUsers}) => {

    useEffect(() => {
        if(defaultUsers){
            const defaultUserNames = defaultUsers.map((userId) => {
                const user = users.find((user) => user._id === userId);
                return {
                    label: `${user.firstname} ${user.lastname}`,
                    value: user._id,
                };
            });
            setSelectedUsers(defaultUserNames);
            console.log(selectedUsers);
        }
    }, [defaultUsers]);

    useEffect(()=>{
        if(defaultUsersOfProject){
            const developersIds = defaultUsersOfProject.map(dev => dev._id);

            const defaultUserNames = developersIds.map((defUser) => {
                const user = projUsers.find((user) => user._id === defUser);
                return {
                    label: `${user.firstname} ${user.lastname}`,
                    value: user._id,
                };
            });
            setSelectedUsers(defaultUserNames);
        }
        },[defaultUsersOfProject])

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
            defaultValue={defaultUsersOfProject}
            options={options}
            isMulti
        />
    );
};

export default MultiSelect;
