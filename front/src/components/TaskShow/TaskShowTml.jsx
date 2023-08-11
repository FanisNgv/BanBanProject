import React, {useEffect, useState} from 'react';
import '../Modal/ModalCreateTask.css'
import MultiSelect from "../DropDown/DropDownMulti";
import axios from "axios";
import MyDatePicker from "../DatePicker/DatePicker";

const TaskShowTml = ({selectedTaskID, selectedProject,setTasks, teamLeadTaskOpened, projUsers,setIsLoading, taskDeadline, taskName, taskDescr,taskDevs, setTaskName, setTaskDeadline, setTaskDescr, setTaskDevs, setTeamLeadTaskOpened, setSelectedTaskID}) => {


    const [selectedUsers, setSelectedUsers] = useState([]);
    const [startDate, setStartDate] = useState();

    async function changeTask(){
        if(taskName===""){
            alert("Введите название задачи!");
            return;
        }
        else if(selectedUsers.length===0){
            alert("Выберите хотя бы одного разработчика, ответственного за задачу!");
            return;
        }
        setIsLoading(true);
        const selectedUserIds = selectedUsers.map(user => user.value);

        const task={_id: selectedTaskID, taskName:taskName, developers: selectedUserIds, description:taskDescr, deadline:taskDeadline};
        await fetch('http://localhost:5000/auth/updateTaskGlobally', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(task)
        })
            .then(response => response.json())
            .then(data => {
            })
            .catch(error => console.error(error));

        await fetch('http://localhost:5000/auth/getTasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(selectedProject),
        })
            .then(response => response.json())
            .then(data => {
                setTasks(data);
            })
            .catch(error => console.error(error));

        setIsLoading(false);
    }

    function handleChangeTaskName(event) {
        setTaskName(event.target.value);
    }
    function handleChangeTaskDescr(event) {
        setTaskDescr(event.target.value);
    }
    const handleSelectedUsers = (selectedUsers) => {
        setSelectedUsers(selectedUsers);
    };


    async function deleteTask() {
        setIsLoading(true);
        const task={_id: selectedTaskID};

        await fetch('http://localhost:5000/auth/deleteTask', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({task, selectedProject})
        })
            .then(response => response.json())
            .then(data => {
            })
            .catch(error => console.error(error));


        await fetch('http://localhost:5000/auth/getTasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(selectedProject),
        })
            .then(response => response.json())
            .then(data => {
                setTasks(data);
            })
            .catch(error => console.error(error));
        setTeamLeadTaskOpened(false);

        setIsLoading(false);


    }

    return (
        <div className={teamLeadTaskOpened ? "modal active" : "modal"} onClick={function () { setTeamLeadTaskOpened(false)}}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                <div className="createNewTask">
                    <div className="taskName">
                        <h1>Название задачи:</h1>
                        <input type="text" value={taskName} placeholder={"Введите название задачи"} onChange={handleChangeTaskName} required />
                    </div>
                    <div className="taskDevs">
                        <h1>Ответственные за выполнение задачи:</h1>
                        <MultiSelect users={projUsers} updateSelectedUsers={handleSelectedUsers} defaultUsers={taskDevs} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/>

                    </div>
                    <div className="taskDesc">
                        <h1>Описание задачи:</h1>
                        <input type="text" value={taskDescr} placeholder={"Введите описание задачи"} onChange={handleChangeTaskDescr} required />
                    </div>
                    <div className="taskDeadline">
                        <h1>Дедлайн задачи:</h1>
                        <MyDatePicker startDate={taskDeadline} setStartDate={setTaskDeadline}/>
                    </div>
                    <div className="butt">
                        <button id="changeTaskButton" onClick={changeTask}>Изменить задачу</button>
                        <button id="deleteTaskButton" onClick={deleteTask}>Удалить задачу</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskShowTml;