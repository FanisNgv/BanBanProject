import React, {useCallback, useEffect, useState} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Desk.css'
import {Backdrop, CircularProgress} from '@mui/material';
import Menu from "../Menu/Menu";
import moment from 'moment';
import Modal from "../Modal/Modal";
import DropDown from "../DropDown/DropDownSingle.jsx"
import ModalCreateTask from "../Modal/ModalCreateTask";
import axios from 'axios';
import ModalDeveloper from "../Modal/ModalDeveloper";
import PersonalUserSelect from "../personalUserSelect/PersonalUserSelect";
import TaskShowTml from "../TaskShow/TaskShowTml";
import TaskShowDvl from "../TaskShow/TaskShowDvl";

const Desk = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({
        lastname:"",
        firstname:"",
        email:"",
        role:""
    });

    const[personalTasks, setPersonalTasks] = useState([]);
    const[personalTasksSelected, setPersonalTasksSelected] = useState(false);
    const[personalTasksText, setPersonalTasksText] = useState( "Личная доска");
    const[projUsers, setProjUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const[selectedProject, setSelectedProject]=useState();
    const [modalActive, setModalActive] = useState();
    const[tasks, setTasks]=useState([]);
    const[modalCreateTaskActive, setModalCreateTaskActive]=useState(false);
    const[teamLeadTaskOpened, setTeamLeadTaskOpened] = useState(false);
    const[devTaskOpened, setDevTaskOpened]=useState(false);

    const[selectedUser, setSelectedUser]=useState();
    const[selectUserModalOpened, setSelectUserModalOpened] = useState(false);
    const[selectedTaskID, setSelectedTaskID] = useState();
    const[taskName, setTaskName] = useState();
    const[taskDevs,setTaskDevs]=useState();
    const[taskDeadline,setTaskDeadline]=useState();
    const[taskDescr, setTaskDescr]=useState();

    const handlePersonalTaskClick=()=>{
        if(user.role==="Developer") {
            if (!selectedProject) {
                alert("Выберите проект!");
                return;
            }
            const token = localStorage.getItem('token');
            if (!personalTasksSelected) {
                setIsLoading(true);
                if (!token) {
                    console.error('Token not found in localStorage');
                    return;
                }
                try {
                    fetch('http://localhost:5000/auth/getPersonalTasks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            Authorization: `Bearer ${token}`

                        },
                        body: JSON.stringify(selectedProject),
                    })
                        .then(response => response.json())
                        .then(data => {
                            setTasks(data);
                        })
                        .catch(error => console.error(error));
                } catch (e) {

                }
                setPersonalTasksSelected(true);
                setPersonalTasksText("Общая доска");
                alert("Личная доска выбрана!");
                setIsLoading(false);
            } else {
                setIsLoading(true);
                if (!token) {
                    console.error('Token not found in localStorage');
                    return;
                }
                try {
                    fetch('http://localhost:5000/auth/getTasks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            Authorization: `Bearer ${token}`

                        },
                        body: JSON.stringify(selectedProject),
                    })
                        .then(response => response.json())
                        .then(data => {
                            setTasks(data);
                        })
                        .catch(error => console.error(error));
                } catch (e) {

                }
                setPersonalTasksSelected(false);
                setPersonalTasksText("Личная доска");
                alert("Общая доска выбрана!");
                setIsLoading(false);
            }
        } else if(user.role==="TeamLead"){
            if (!selectedProject){
                alert("Для перехода в личную доску разработчика выберите проект!")
                return;
            }
            setSelectUserModalOpened(true);
        }
    }
    async function handleTaskClickTml(taskId){
        await setSelectedTaskID(taskId);
        setTeamLeadTaskOpened(true);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }
    async function handleTaskClickDev(taskId){
        await setSelectedTaskID(taskId);
        setDevTaskOpened(true);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }

    useEffect(() => {
        if (selectedTaskID) {
            fetch('http://localhost:5000/auth/getTask', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({selectedTaskID})
            })
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        setTaskName(data.taskName);
                        setTaskDevs(data.developers);
                        const formattedDeadline = new Date(data.deadline).toLocaleString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        });
                        setTaskDeadline(moment(formattedDeadline).toDate());
                        setTaskDescr(data.description);
                    }
                })
                .catch(error => console.error(error));
        }
    }, [selectedTaskID]);

    const handleProjectsClick = () => {
        setModalActive(true);
    };

    function createTask(){
        if(selectedProject===undefined){
            alert("Выберите проект, чтобы добавлять задачи!")
        }
        else {
            setModalCreateTaskActive(true);
        }
    }

    const MenuItems=[{value:"Проекты", action:handleProjectsClick, icon: "project"},
        {value: personalTasksText, action:handlePersonalTaskClick, icon:"persons"}];

    useEffect(() => {
        const fetchData = (async () => {
            console.log('Добавили элемент!')
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }
            try {
                const {data: response} = await axios.get('http://localhost:5000/auth/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser({
                    lastname: response.lastname,
                    firstname: response.firstname,
                    email: response.email,
                    role: response.roles[0]
                });
            } catch (error) {
                console.error(error.message);
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
            setIsLoading(false);
        });
        fetchData();
    }, []);

    const [menuActive, setMenuActive] = useState(false);


    const [columns, setColumns] = useState(() => ({
        '1': {
            id: '1',
            title: 'To Do',
            tasks: [],
        },
        '2': {
            id: '2',
            title: 'In Progress',
            tasks: [],
        },
        '3': {
            id: '3',
            title: 'In Testing',
            tasks: [],
        },
        '4': {
            id: '4',
            title: 'Done',
            tasks: [],
        },
    }));
    useEffect(() => {
        console.log(columns);
    }, [columns]);

    useEffect(() => {
        for (const columnId in columns) {
            const column = columns[columnId];
            column.tasks = [];
        }
        setColumns(columns);
        // cleanup function to reset tasks array of each column to an empty array
        return () => {
            for (const columnId in columns) {
                const column = columns[columnId];
                column.tasks = [];
            }
            setColumns(columns);
        }
    }, [tasks]);

    useEffect(() => {
        tasks.forEach((task) => {
            const { _id, status } = task;
            const columnId = status.toString();
            if (!columns[columnId].tasks.find((t) => t._id === _id)) {
                setColumns((prevColumns) => ({
                    ...prevColumns,
                    [columnId]: {
                        ...prevColumns[columnId],
                        tasks: [...prevColumns[columnId].tasks, task],
                    },
                }));
            }
        });
    }, [tasks]);

    const onDragEnd = async (result) => {
        if(user.role !== 'Developer') {
            alert("Выполнением задач занимаются разработчики!")
            return;
        }
        if(!personalTasksSelected){
            alert("Перейдите в личную доску!");
            return;
        }
        const { source, destination, draggableId } = result;

        if (!destination) {
            return;
        }

        const sourceColumn = columns[source.droppableId];
        const destinationColumn = columns[destination.droppableId];
        const task = sourceColumn.tasks.find((t) => t._id === draggableId);

        if (sourceColumn === destinationColumn) {
            const newItems = Array.from(sourceColumn.tasks);
            newItems.splice(source.index, 1);
            newItems.splice(destination.index, 0, task);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    tasks: newItems,
                },
            });
        } else {
            const sourceItems = Array.from(sourceColumn.tasks);
            sourceItems.splice(source.index, 1);

            const destinationItems = Array.from(destinationColumn.tasks);
            destinationItems.splice(destination.index, 0, task);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    tasks: sourceItems,
                },
                [destination.droppableId]: {
                    ...destinationColumn,
                    tasks: destinationItems,
                },
            });

            const updatedTask = { ...task, status: destinationColumn.id };
            const { data } = await axios.put(
                'http://localhost:5000/auth/updateTask',
                updatedTask
            );
            setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
        }
    };

    if(user.role==='TeamLead'){
        return (
            <div className="Desk">
                <header>
                    <div className="MainBar">
                        <Menu active={menuActive} setActive={setMenuActive} action={true} header={"Главное меню"} items = {MenuItems}/>
                        <h1 className="logo" onClick={()=>setMenuActive(!menuActive)}>BanBanTML</h1>
                        {selectedProject && <h1>{selectedProject.label}</h1>}
                        <div className="userName">
                            <div className="projectIcon">
                                {!personalTasksSelected&&<span className="material-symbols-outlined">groups</span>}
                                {personalTasksSelected&&<span className="material-symbols-outlined">person</span>}
                            </div>
                            <h1>{user.lastname} {user.firstname}</h1>
                        </div>
                    </div>
                </header>
                <div>
                    <PersonalUserSelect  setSelectUserModalOpened={setSelectUserModalOpened} selectUserModalOpened={selectUserModalOpened} selectedProject={selectedProject} setTasks={setTasks} setIsLoading={setIsLoading} projUsers={projUsers} personalTasksSelected={personalTasksSelected} setPersonalTasksSelected={setPersonalTasksSelected} selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
                    <ModalCreateTask tasks={tasks} setTasks={setTasks} setIsLoading={setIsLoading} selectedProj={selectedProject} projUsers={projUsers} modalCreateTaskActive={modalCreateTaskActive} setModalCreateTaskActive={setModalCreateTaskActive}/>
                    <Modal setPersonalTaskSelected={setPersonalTasksSelected} tasks={tasks} setTasks={setTasks} projects={projects} selectedProject={selectedProject}
                           setProjUsers={setProjUsers} projectUsers={projUsers} setSelectedProject={setSelectedProject} setProjects={setProjects}
                           setIsLoading={setIsLoading} active={modalActive} setActive={setModalActive}
                           component={DropDown}/>
                    <TaskShowTml  selectedProject={selectedProject} setProjects={setProjects} setTasks={setTasks} selectedTaskID={selectedTaskID} projUsers={projUsers} taskName={taskName} setTaskName={setTaskName} taskDevs={taskDevs} setTaskDevs={setTaskDevs} taskDescr={taskDescr} setTaskDescr={setTaskDescr} taskDeadline={taskDeadline} setTaskDeadline={setTaskDeadline} setSelectedTaskID={setSelectedTaskID} selectedTaskID={selectedTaskID} teamLeadTaskOpened={teamLeadTaskOpened} setTeamLeadTaskOpened={setTeamLeadTaskOpened} setIsLoading={setIsLoading}/>
                    <Backdrop open={isLoading}>
                        <CircularProgress/>
                    </Backdrop>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="kanban-board">
                        {Object.values(columns).map((column) => (
                            <div className="kanban-column" key={column.id}>
                                <div className="ToDo">
                                    <h2>{column.title}</h2>
                                    {column.title === "To Do" && !personalTasksSelected && (
                                        <button onClick={createTask}>+</button>
                                    )}
                                </div>
                                <Droppable droppableId={column.id}>
                                    {(provided) => (
                                        <ul
                                            className="kanban-items"
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {column.tasks.map((item, index) => (
                                                <Draggable
                                                    key={item._id}
                                                    draggableId={item._id}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <li
                                                            className="kanban-item"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={()=> {handleTaskClickTml(item._id)}

                                                        }

                                                        >
                                                            {item.taskName}
                                                        </li>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </ul>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        );
    }

    else if(user.role==='Developer'){
        return (
            <div className="Desk">
                <header>
                    <div className="MainBar">
                        <Menu active={menuActive} setActive={setMenuActive} action={true} header={"Главное меню"}
                              items={MenuItems}/>
                        <h1 className="logo" onClick={() => setMenuActive(!menuActive)}>BanBanDVL</h1>
                        {selectedProject && <h1>{selectedProject.label}</h1>}
                        <div className="userName">
                            <div className="projectIcon">
                                {!personalTasksSelected&&<span className="material-symbols-outlined">groups</span>}
                                {personalTasksSelected&&<span className="material-symbols-outlined">person</span>}
                            </div>
                                <h1>{user.lastname} {user.firstname}</h1>
                        </div>
                    </div>
                </header>
                <div>
                    <ModalDeveloper setPersonalTaskSelected={setPersonalTasksSelected} setPersonalTaskText={setPersonalTasksText} tasks={tasks} setTasks={setTasks} projects={projects} selectedProject={selectedProject} setProjUsers={setProjUsers} setSelectedProject={setSelectedProject} setProjects={setProjects} setIsLoading={setIsLoading} active={modalActive} setActive={setModalActive} component={DropDown}/>
                    <TaskShowDvl  selectedProject={selectedProject} setTasks={setTasks} selectedTaskID={selectedTaskID} projUsers={projUsers} taskName={taskName} setTaskName={setTaskName} taskDevs={taskDevs} setTaskDevs={setTaskDevs} taskDescr={taskDescr} setTaskDescr={setTaskDescr} taskDeadline={taskDeadline} setTaskDeadline={setTaskDeadline} setSelectedTaskID={setSelectedTaskID} devTaskOpened={devTaskOpened} setDevTaskOpened={setDevTaskOpened} setIsLoading={setIsLoading}/>
                    <Backdrop open={isLoading}>
                        <CircularProgress/>
                    </Backdrop>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="kanban-board">
                        {Object.values(columns).map((column) => (
                            <div className="kanban-column" key={column.id}>
                                <div className="ToDo">
                                    <h2>{column.title}</h2>
                                </div>
                                <Droppable droppableId={column.id}>
                                    {(provided) => (
                                        <ul
                                            className="kanban-items"
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {column.tasks.map((item, index) => (
                                                <Draggable
                                                    key={item._id}
                                                    draggableId={item._id}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <li
                                                            className="kanban-item"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => handleTaskClickDev(item._id)}

                                                        >
                                                            {item.taskName}
                                                        </li>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </ul>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        );
    }

};

export default Desk;