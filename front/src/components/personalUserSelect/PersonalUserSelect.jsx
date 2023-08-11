import React, {useEffect, useState} from 'react';
import '../Modal/ModalCreateTask.css'
import MultiSelect from "../DropDown/DropDownMulti";
import axios from "axios";
import SingleSelect from "../DropDown/DropDownSingle";
import SingleSelectUser from "../DropDown/DropDownSingleUser";

const PersonalUserSelect = ({selectedProject,setSelectUserModalOpened, selectUserModalOpened, setIsLoading, setTasks, projUsers, personalTasksSelected, setPersonalTasksSelected, selectedUser, setSelectedUser}) => {

    async function selectUser(){
        if(!selectedUser){
            alert("Выберите разработчика, чтобы перейти к его доске!");
            return;
        }
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }
        //const selectedUserId = selectedUser.value;
        console.log(selectedUser);
        await fetch('http://localhost:5000/auth/getPersonalTasksAsTml', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
            body: JSON.stringify({selectedUser, selectedProject})
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setTasks(data);
                }
            })
            .catch(error => console.error(error));
        setIsLoading(false);
        setPersonalTasksSelected(true);
    }
    const handleSelectedUsers = (selectedUser) => {
        setSelectedUser(selectedUser);
    };

    return (
        <div className={selectUserModalOpened ? "modal active" : "modal"} onClick={function () {setSelectUserModalOpened(false)}}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                <div className="createNewTask">
                    <div className="taskDevs">
                        <h1>Выберите разработчика, чтобы перейти к его доске:</h1>
                        <SingleSelectUser projUsers={projUsers} updateSelectedUsers={handleSelectedUsers}/>
                    </div>
                    <div className="butt">
                        <button onClick={selectUser}>Выбрать разработчика</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalUserSelect;