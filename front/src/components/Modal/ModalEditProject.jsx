import React, {useEffect, useState} from 'react';
import MultiSelect from "../DropDown/DropDownMulti";
import axios from "axios";

const ModalEditProject = ({setIsLoading, setSelectedProject,setProjectDevs, selectedProject, setProjects, projectDescr, projectDevs, projectName,projectUsers, setProjectName, setProjectDescr, setProjUsers}) => {

    const [projectDescrEdit, setProjectDescrEdit] = useState(projectDescr);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const[users, setUsers]=useState([]);

    async function changeProject(){
        if(projectName===""){
            alert("Введите название измененного проекта!");
            return;
        }
        else if(selectedUsers.length===0){
            alert("Выберите хотя бы одного разработчика, участвующего в проекте!");
            return;
        }
        setIsLoading(true);
        const selectedUserIds = selectedUsers.map(user => user.value);


        const project={_id:selectedProject.value, projectName:projectName, members: selectedUserIds, description:projectDescrEdit};
        await fetch('http://localhost:5000/auth/updateProject', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(project)
        })
            .then(response => response.json())
            .then(data => {
            })
            .catch(error => console.error(error));

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }

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
        try {
            fetch('http://localhost:5000/auth/getProjectInfo', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(selectedProject),
            })
                .then(response => response.json())
                .then(data => {
                    setProjectDescr(data.project.description);
                    setProjectDevs(data.devs);
                    setProjectName(data.project.projectName);
                    setSelectedProject(prevState => ({...prevState, label: data.project.projectName}));
                })
                .catch(error => console.error(error));
        }catch (e){

        }
        setIsLoading(false);
        alert("Проект изменен!");
    }


    const handleSelectedUsers = (selectedUsers) => {
        setSelectedUsers(selectedUsers);
    };
    function handleChangeProjName(event) {
        setProjectName(event.target.value);
    }
    function handleChangeProjDescr(event) {
        setProjectDescrEdit(event.target.value);
    }

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
                <h1>Название проекта:</h1>
                <input type="text" value={projectName} placeholder={"Введите название"} onChange={handleChangeProjName}  required />
            </div>
            <div className="projectDevs">
                <h1>Разработчики вашего проекта:</h1>
                <MultiSelect users={users} projUsers={projectUsers} updateSelectedUsers={handleSelectedUsers} defaultUsersOfProject={projectDevs} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/>

            </div>
            <div className="projectDescr">
                <h1>Описание проекта:</h1>
                <input type="text" value={projectDescrEdit} placeholder={"Введите описание"} onChange={handleChangeProjDescr}/>
            </div>
            <div className="but">
                <button onClick={changeProject}>Изменить проект</button>
            </div>
        </div>
    );
};

export default ModalEditProject;