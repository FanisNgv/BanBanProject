import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from '../Task/Task';

function TaskList(props) {
    return (
        <Droppable droppableId={props.droppableId}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    <h2>{props.title}</h2>
                    {props.tasks.map((task, index) => (
                        <Task key={task.id} task={task} index={index} />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}

export default TaskList;