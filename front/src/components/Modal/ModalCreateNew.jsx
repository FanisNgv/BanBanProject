import React, {useEffect, useState} from 'react';
import './ModalCreateNew.css'
import MultiSelect from "../DropDown/DropDownMulti";
import axios from "axios";
import MultiSelectCreateProject from "../DropDown/MultiSelectCreateProject";

const ModalCreateNew = ({setIsLoading, setCreateButtonClicked, setProjects}) => {
    const[projectName, setProjectName]=useState("");
    const[projectDescr, setProjectDescr]=useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const handleSelectedUsers = (selectedUsers) => {
        setSelectedUsers(selectedUsers);
    };
    function handleChangeProjName(event) {
        setProjectName(event.target.value);
    }
    function handleChangeProjDescr(event) {
        setProjectDescr(event.target.value);
    }
    async function createProject(){

        if(projectName===""){
            alert("Введите имя проекта!");
            return;
        }
        else if(selectedUsers.length===0){
            alert("Выберите хотя бы одного разработчика, участвующего в проекте!");
            return;
        }
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }
        const selectedUserIds = selectedUsers.map(user => user.value);

        console.log(selectedUserIds);
        const project={projectName:projectName, members: selectedUserIds, description:projectDescr};
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
                <h1>Введите название проекта:</h1>
                <input type="text" value={projectName} placeholder={"Введите название"} onChange={handleChangeProjName}  required />
            </div>
            <div className="projectDevs">
                <h1>Добавьте разработчиков в ваш проект:</h1>
                <MultiSelectCreateProject users={users} updateSelectedUsers={handleSelectedUsers}/>
            </div>
            <div className="projectDescr">
                <h1>Введите описание проекта:</h1>
                <input type="text" value={projectDescr} placeholder={"Введите описание"} onChange={handleChangeProjDescr}/>
            </div>
            <div className="but">
                <button onClick={createProject}>Создать проект</button>
            </div>
        </div>
    );
};

export default ModalCreateNew;