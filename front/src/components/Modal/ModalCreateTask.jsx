import React, {useEffect, useState} from 'react';
import './ModalCreateTask.css'
import MultiSelect from "../DropDown/DropDownMulti";
import axios from "axios";
import ModalCreateNew from "./ModalCreateNew";
import {DatePicker} from "@mui/x-date-pickers";
import MyDatePicker from "../DatePicker/DatePicker";

const ModalCreateTask = ({setIsLoading,selectedProj, tasks, setTasks, projUsers, modalCreateTaskActive, setModalCreateTaskActive}) => {

    const[users, setUsers] = useState([]);
    const[taskName, setTaskName]=useState("");
    const[taskDesc, setTaskDesc]=useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    async function createTask(){

        if(taskName===""){
            alert("Введите название задачи!");
            return;
        }
        else if(selectedUsers.length===0){
            alert("Выберите хотя бы одного разработчика, ответственного за задачу!");
            return;
        }
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }
        const selectedUserIds = selectedUsers.map(user => user.value);

        const task={taskName:taskName, developers: selectedUserIds, description:taskDesc, deadline:startDate, project:selectedProj};
        await fetch('http://localhost:5000/auth/createTask', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
            body: JSON.stringify(task)
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    //alert(data.message);
                    setTasks([...tasks, data]);
                }
            })
            .catch(error => console.error(error));
        setTaskName("");
        setTaskDesc("");
        setStartDate(new Date())
        setIsLoading(false);
    }

    /*useEffect(() => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }
        const fetchData = async () =>{
            try {
                const {data: response} = await axios.get('http://localhost:5000/auth/getDevelopers', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response);

            } catch (error) {
                console.error(error.message);
            }

            setIsLoading(false);
        }
        fetchData();
    }, []);
*/
    function handleChangeTaskName(event) {
        setTaskName(event.target.value);
    }
    function handleChangeTaskDescr(event) {
        setTaskDesc(event.target.value);
    }
    const handleSelectedUsers = (selectedUsers) => {
        setSelectedUsers(selectedUsers);
    };


    return (
    <div className={modalCreateTaskActive ? "modal active" : "modal"} onClick={function () { setModalCreateTaskActive(false)}}>
        <div className="modal__content" onClick={e => e.stopPropagation()}>
            <div className="createNewTask">
                <div className="taskName">
                    <h1>Введите название задачи:</h1>
                    <input type="text" value={taskName} placeholder={"Введите название задачи"} onChange={handleChangeTaskName} required />
                </div>
                <div className="taskDevs">
                    <h1>Выберите ответственных за выполнение задачи:</h1>
                    <MultiSelect users={projUsers} updateSelectedUsers={handleSelectedUsers} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/>
                </div>
                <div className="taskDesc">
                    <h1>Описание задачи:</h1>
                    <input type="text" value={taskDesc} placeholder={"Введите описание задачи"} onChange={handleChangeTaskDescr} required />
                </div>
                <div className="taskDeadline">
                    <h1>Выберите дедлайн:</h1>
                    <MyDatePicker startDate={startDate} setStartDate={setStartDate}/>
                </div>
                <div className="butt">
                    <button onClick={createTask}>Создать задачу</button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default ModalCreateTask;