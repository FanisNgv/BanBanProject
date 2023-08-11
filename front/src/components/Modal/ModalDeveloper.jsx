import React, {useEffect, useState} from 'react';
import './Modal.css'
import ModalCreateNew from "./ModalCreateNew";
import axios from "axios";
const ModalDeveloper = ({tasks, setPersonalTaskSelected, setPersonalTaskText ,projects,setSelectedProject, setTasks ,setProjUsers, selectedProject, setProjects,setIsLoading, active, setActive, component:Component}) => {

    const[createButtonClicked, setCreateButtonClicked] = useState(false);
    const[deleteButtonClicked, setDeleteButtonClicked] = useState(false);
    const[tempSelected, setTempSelected] = useState();
    const [currentComponent, setCurrentComponent] = useState(<Component projects={projects} />);

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

    async function handleSelect(){
        try{
            if(!tempSelected){
                alert("Вы не выбрали проект!")
            }
            else{
                setSelectedProject(tempSelected);

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
                        })
                        .catch(error => console.error(error));
                }catch (e){

                }
                setPersonalTaskSelected(false);
                setPersonalTaskText("Личная доска");
                setCreateButtonClicked(false);
                setIsLoading(false);
                alert("Проект выбран!")
            }

        }catch (e){
            alert(e);
        }
    }
    function handleChange(){
        setDeleteButtonClicked(true);
    }
    if(!createButtonClicked&&!deleteButtonClicked) {
        return (
            <div className={active ? "modal active back" : "modal"} onClick={function () { setActive(false);setCreateButtonClicked(false)}}>
                <div className="modal__content" onClick={e => e.stopPropagation()}>
                    <h1>Выберите проект, в котором вы участвуете</h1>
                    <Component projects={projects} setTempSelected={setTempSelected} tempSelected={tempSelected}/>
                    {projectDescr && <h1>Описание проекта:</h1>}
                    {projectDescr && <br/>}
                    {projectDescr && <p>{projectDescr}</p>}
                    {projectDescr&&<DeveloperList projectDevs={projectDevs} />}
                    <button id="selectButOfDev" onClick={handleSelect}>Выбрать</button>
                </div>
            </div>
        );
    }
};

export default ModalDeveloper;