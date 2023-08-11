import React, {useEffect, useState} from 'react';
import './Modal.css'
import ModalCreateNew from "./ModalCreateNew";
import axios from "axios";
import ModalEditProject from "./ModalEditProject";
const Modal = ({tasks, setPersonalTaskSelected,projectUsers, projects,setSelectedProject, setTasks ,setProjUsers, selectedProject, setProjects,setIsLoading, active, setActive, component:Component}) => {

    const[createButtonClicked, setCreateButtonClicked] = useState(false);
    const[changeButtonClicked, setChangeButtonClicked] = useState(false);
    const[tempSelected, setTempSelected] = useState();
    const [currentComponent, setCurrentComponent] = useState(<Component projects={projects} />);

    const[projectName, setProjectName]=useState();
    const[projectDescr, setProjectDescr] = useState();
    const[projectDevs, setProjectDevs]=useState([]);

    function DeveloperList({ projectDevs }) {
        const devNames = projectDevs.map(dev => {
            const firstName = dev.firstname;
            const lastName = dev.lastname;
            return { firstName, lastName };
        });
        return (
            <div className="projectDevs">
                <h1>Разработчики проекта:</h1>
                <ul>
                    {devNames.map((dev, index) => (
                        <li key={index}>{dev.firstName} {dev.lastName}</li>
                    ))}
                </ul>
            </div>
        );
    }

    function handleCreateNew(){
        setCreateButtonClicked(true);
        setCurrentComponent(<ModalCreateNew/>)
    }
    async function handleSelect(){
        try{
            if(!tempSelected){
             alert("Вы не выбрали проект!")
            }
            else{
                setSelectedProject(tempSelected);
                console.log(tempSelected);
                try {
                    await fetch('http://localhost:5000/auth/getProjDevs', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(tempSelected),
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            setProjUsers(data);
                        })
                        .catch(error => console.error(error));
                }catch (e){

                }
                try {
                    fetch('http://localhost:5000/auth/getTasks', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(tempSelected),
                    })
                        .then(response => response.json())
                        .then(data => {
                            setTasks(data);
                        })
                        .catch(error => console.error(error));
                }catch (e){

                }

                try {
                    fetch('http://localhost:5000/auth/getProjectInfo', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(tempSelected),
                    })
                        .then(response => response.json())
                        .then(data => {
                            setProjectDescr(data.project.description);
                            setProjectDevs(data.devs);
                            setProjectName(data.project.projectName);
                        })
                        .catch(error => console.error(error));
                }catch (e){

                }

                setPersonalTaskSelected(false);
                setCreateButtonClicked(false);
                setIsLoading(false);
                alert("Проект выбран!")
            }

        }catch (e){
            alert(e);
        }
    }
    function handleChange(){
        if (!selectedProject){
            alert("Выберите проект, который необходимо изменить!");
        }
        else {
            setChangeButtonClicked(true);

        }
    }
    if(!createButtonClicked&&!changeButtonClicked) {
        return (

            <div className={active ? "modal active back" : "modal"} onClick={function () { setActive(false);setCreateButtonClicked(false)}}>
                <div className="modal__content" onClick={e => e.stopPropagation()}>
                    <h1>Выберите проект</h1>
                    <Component projects={projects} setTempSelected={setTempSelected} tempSelected={tempSelected}/>
                    {projectDescr && <h1>Описание проекта:</h1>}
                    {projectDescr && <br/>}
                    {projectDescr && <p>{projectDescr}</p>}
                    {projectDescr&&<DeveloperList projectDevs={projectDevs} />}

                    <div className="buttons">
                        <button onClick={handleCreateNew}>Создать новый</button>
                        <button onClick={handleSelect}>Выбрать</button>
                        <button onClick={handleChange}>Изменить</button>
                    </div>
                </div>
            </div>
        );
    }
    else if(createButtonClicked){
        return (
            <div className={active ? "modal active" : "modal"} onClick={function () { setActive(false);setCreateButtonClicked(false)}}>
                <div className="modal__content" onClick={e => e.stopPropagation()}>
                    <ModalCreateNew setProjUsers={setProjUsers} setIsLoading={setIsLoading} setCreateButtonClicked={setCreateButtonClicked} setProjects={setProjects}/>
                </div>
            </div>
        );
    }
    else if(changeButtonClicked){
        return (
            <div className={active ? "modal active" : "modal"} onClick={function () { setActive(false);setChangeButtonClicked(false)}}>
                <div className="modal__content" onClick={e => e.stopPropagation()}>
                    <ModalEditProject setSelectedProject={setSelectedProject} setProjectDevs={setProjectDevs} projectName={projectName} selectedProject={selectedProject} projectUsers={projectUsers} setProjectName={setProjectName} setProjectDescr={setProjectDescr}  projectDescr={projectDescr} projectDevs={projectDevs} setProjUsers={setProjUsers} setIsLoading={setIsLoading} setChangeButtonClicked={setChangeButtonClicked} setProjects={setProjects}/>
                </div>
            </div>
        );
    }
};

export default Modal;