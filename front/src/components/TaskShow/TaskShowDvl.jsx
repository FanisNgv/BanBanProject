import React, {useEffect, useState} from 'react';
import '../Modal/ModalCreateTask.css'
import MultiSelect from "../DropDown/DropDownMulti";
import axios from "axios";
import MyDatePicker from "../DatePicker/DatePicker";

const TaskShowDvl = ({selectedTaskID, selectedProject,setTasks, devTaskOpened, projUsers,setIsLoading, taskDeadline, taskName, taskDescr,taskDevs, setTaskName, setTaskDeadline, setTaskDescr, setTaskDevs, setDevTaskOpened, setSelectedTaskID}) => {


    const [selectedUsers, setSelectedUsers] = useState([]);
    const [startDate, setStartDate] = useState();

    const handleSelectedUsers = (selectedUsers) => {
        setSelectedUsers(selectedUsers);
    };

    return (
        <div className={devTaskOpened ? "modal active" : "modal"} onClick={function () { setDevTaskOpened(false)}}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                <div className="createNewTask">
                    <div className="taskName">
                        <h1>Название задачи:</h1>
                        <input type="text" value={taskName} placeholder={"Введите название задачи"}  required />
                    </div>
                    <div className="taskDevs">
                        <h1>Ответственные за выполнение задачи:</h1>
                        <MultiSelect users={projUsers} updateSelectedUsers={handleSelectedUsers} defaultUsers={taskDevs} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/>

                    </div>
                    <div className="taskDesc">
                        <h1>Описание задачи:</h1>
                        <input type="text" value={taskDescr} placeholder={"Введите описание задачи"} required />
                    </div>
                    <div className="taskDeadline">
                        <h1>Дедлайн задачи:</h1>
                        <MyDatePicker startDate={taskDeadline} setStartDate={setTaskDeadline}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskShowDvl;