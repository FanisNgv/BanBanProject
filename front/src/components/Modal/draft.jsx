import React, {useEffect, useState} from 'react';
import './ModalCreateNew.css'
import MultiSelect from "../DropDown/DropDownMulti";
import axios from "axios";

const ModalCreateTask = ({setIsLoading, setCreateButtonClicked, setProjects}) => {
    const[taskName, setTaskName]=useState("");
    const[taskDescr, setTaskDescr]=useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const handleSelectedUsers = (selectedUsers) => {
        setSelectedUsers(selectedUsers);
    };
    async function createProject(){

        if(taskName===""){
            alert("Введите имя задания!");
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
        const task={taskName:taskName, status: 1, developers:selectedUserIds, deadline:deadline, description:taskDescr};
        await fetch('http://localhost:5000/auth/createProject', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
            body: JSON.stringify(project)
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    alert(data.message);
                }
            })
            .catch(error => console.error(error));
        setCreateButtonClicked(false);
        setIsLoading(false);
        try {
            const {data: response} = await axios.get('http://localhost:5000/auth/projects', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProjects(response);
        } catch (error) {
            console.error(error.message);
        }
    }

    const[users, setUsers]=useState([]);
    useEffect(() => {
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
    return (
        <div className="createNewBody">
            <div className="projectName">
                <h1>Введите название задачи:</h1>
                <input type="text" value={projectName} placeholder={"Введите название"} onChange={handleChangeProjName}  required />
            </div>
            <div className="projectDevs">
                <h1>Назначьте ответственных за эту задачу:</h1>
                <MultiSelect users={users} updateSelectedUsers={handleSelectedUsers}/>
            </div>
            <div className="taskDeadling">
                <h1>Введите дедлайн:</h1>
                <input type="text" value={projectDescr} placeholder={"Введите дедлайн"} onChange={handleChangeProjDescr}/>
            </div>
            <div className="projectDescr">
                <h1>Введите описание задачи:</h1>
                <input type="text" value={projectDescr} placeholder={"Введите описание"} onChange={handleChangeProjDescr}/>
            </div>
            <div className="but">
                <button onClick={createProject}>Создать проект</button>

            </div>
        </div>
    );
};

export default ModalCreateTask;