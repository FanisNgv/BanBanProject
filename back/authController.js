// node.js использует модульную систему.
// При помощи require подключаем модуль. В данном случае - встроенный.
const User = require('./models/user');
const Project = require('./models/project')
const Task = require('./models/task');
const Role = require('./models/role');
const mongoose = require('mongoose');
const config = require('./config.js');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const {secret} = require("./config");
const express = require("express");
const path = require("path")
const authRouter = require("./authRouter");
const bodyParser = require('body-parser');



const generateAccessToken = (id, roles) =>{
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn:"24h"});
}

class authController{
    async registration(req, res){
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors});
            }
            const {firstName, lastName, email, password, role} = req.body;
            const candidate = await User.findOne({email});
            if (candidate) {
                return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({firstname:firstName, lastname:lastName, email: email, password: hashPassword, roles:[role]})
            await user.save();
            const obj = {
                isRegistered:true,
                message: "Регистрация прошла успешно!"
            };
            res.json(obj);
        }catch(e){
            console.log(e);
            res.status(400).json({message:'Registration error'});
        }
    }
    async login(req, res){
        try{
            const {email, password} = req.body;
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({message:`Пользователь ${email} не найден!`});
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if(!validPassword){
                return res.status(400).json({message:`Введен неверный пароль!`});
            }
            const token = generateAccessToken(user._id, user.roles)
            res.cookie('token', token); // добавляем токен в cookie
            const obj = {
                token: token,
                email: email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.roles,
                message: "Авторизация успешна!"
            };
            return res.json(obj);

        }catch(e){
            console.log(e);
            res.status(400).json({message:'Login error'});
        }
    }
    async getUser(req, res){
         try{
             const authHeader = req.headers.authorization;
             const token = authHeader && authHeader.split(' ')[1];

             if (!token) {
                 return res.sendStatus(401);
             }
             jwt.verify(token, config.secret, async (err, decoded) => {
                 if (err) {
                     console.log(err); // Вывод информации об ошибке в консоль
                     return res.status(401).json({error: 'Unauthorized'});
                 }
                 const userId = decoded.id;
                 const user = await User.findOne({_id: userId});

                 if (!user) {
                     return res.status(404).json({error: 'User not found'});
                 }
                 res.json(user);
             });
             }
             catch(e){
             console.log(e);
             res.status(400).json({message:'Getting users error'});
         }}
    async createProject(req,res){
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.sendStatus(401);
            }
            jwt.verify(token, config.secret, async (err, decoded) => {
                try {
                    if (err) {
                        console.log(err); // Вывод информации об ошибке в консоль
                        return res.status(401).json({error: 'Unauthorized'});
                    }
                    const userId = decoded.id;
                    const {projectName, description, members} = req.body;
                    const candidate = await Project.findOne({projectName});
                    if (candidate) {
                        return res.status(400).json({ message: 'Проект с таким названием уже существует!' });
                    }
                    const newProject = new Project({teamLeadID:userId, projectName:projectName,description:description,members:members, tasks:[]});
                    await newProject.save();
                    return res.status(200).json({ message: 'Проект успешно создан!' });
                }catch (e){
                    console.log(e);
                    res.status(400).json({message:'Ошибка при создании проекта!'});
                }

                }
            );
            console.log('Создано!')

        }catch (e){
            console.log(e);

        }
    }

    async getProjects(req, res){
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.sendStatus(401);
            }
            jwt.verify(token, config.secret, async (err, decoded) => {
                if (err) {
                    console.log(err);
                    return res.status(401).json({error: 'Unauthorized'});
                }
                const userId = decoded.id;
                const user = await User.findOne({_id:userId});

                if(user.roles[0] === "TeamLead"){
                    const projects = await Project.find({teamLeadID: userId});
                    res.json(projects);
                }else if(user.roles[0] === "Developer"){
                    const projects = await Project.find({ members: userId });
                    res.json(projects);
                }
            });
        }catch (e){
            console.log(e);
            res.status(400).json({message:'Projects getting error'});
        }

    }
    async getDevelopers(req, res){
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.sendStatus(401);
            }
            jwt.verify(token, config.secret, async (err, decoded) => {
                if (err) {
                    console.log(err);
                    return res.status(401).json({error: 'Unauthorized'});
                }
                const users = await User.find({ roles: "Developer"});
                res.json(users);

            });
        }catch (e){
            console.log(e);
            res.status(400).json({message:'Projects getting error'});
        }

    }
    async getProjDevs(req, res){
        try {
            const projectId = req.body.value;
            const project = await Project.findOne({_id: projectId});
            const projMembers = project.members;
            const users = await User.find({ _id: { $in: projMembers } });
            return res.json(users);
        }catch (e){
            console.log(e);
            res.status(400).json({message:'Project users getting error'});
        }
    }

    async deleteTask(req, res){
        try {
            const deletedTask = await Task.findOneAndDelete({ _id: req.body.task._id });
            const updatedProject = await Project.findOneAndUpdate(
                { _id: req.body.selectedProject.value },
                { $pull: { tasks: req.body._id } },
                { new: true }
            );
            return res.json(updatedProject);
        }catch (e){
            console.log(e);
            res.status(400).json({message:'Project users getting error'});
        }

    }
    async getTasks(req, res){
        try {
            const projectId = req.body.value;
            const project = await Project.findOne({_id: projectId});
            const projTasks = project.tasks;
            const tasks = await Task.find({ _id: { $in: projTasks } });
            return res.json(tasks);
        }catch (e){
            console.log(e);
            res.status(400).json({message:'Project users getting error'});
        }
    }
    async updateTaskGlobally(req, res){
        try {
            const taskID = req.body._id;
            const taskName = req.body.taskName;
            const taskDescr = req.body.description;
            const taskDevs = req.body.developers;
            const taskDeadline = req.body.deadline;
            const result = await Task.findOneAndUpdate({_id:taskID}, { $set: {taskName:taskName, developers:taskDevs, deadline: taskDeadline, description: taskDescr}});
            return res.json(result);

        }catch (e){
            console.log(e);
            res.status(400).json({message:'Project users getting error'});
        }
    }
    async updateTask(req, res){
        try {
            const taskID = req.body._id;
            const result = await Task.findOneAndUpdate({_id:taskID}, { $set: {status: req.body.status}});
        }catch (e){
            console.log(e);
            res.status(400).json({message:'Project users getting error'});
        }
    }
    async updateProject(req, res){
        try {
            console.log(req.body);
            const projectID = req.body._id;
            const projectName = req.body.projectName;
            const projectDevs = req.body.members;
            const projectDescr = req.body.description;
            const result = await Project.findOneAndUpdate({_id:projectID}, { $set: {projectName:projectName, description:projectDescr}});
            return res.json(result);
        }catch (e){
            console.log(e);
            res.status(400).json({message:'Project users getting error'});
        }
    }
    async getProjectInfo(req, res){
        try {
            console.log(req.body);
            const projectID = req.body.value;
            const project = await Project.findOne({_id:projectID});
            const devs = await User.find({ _id: { $in: project.members } });
            return res.json({project, devs});
        }catch (e){
            console.log(e);
            res.status(400).json({message:'Project users getting error'});
        }
    }

    async getTask(req, res){
        try {
            const taskID = req.body.selectedTaskID;
            const result = await Task.findOne({_id:taskID});
            return res.json(result);

        }catch (e){
            console.log(e);
            res.status(400).json({message:'Project users getting error'});
        }
    }

    async getPersonalTasksAsTml(req, res){
        try {
            const userId = req.body.selectedUser.value;
            const projectId = req.body.selectedProject.value
            const project = await Project.findOne({ _id: projectId });
            const projTasks = project.tasks;
            const tasks = await Task.find({ developers: { $in: [userId] }, _id: { $in: projTasks } });
            return res.json(tasks);
        }catch (e){
            console.log(e);
            res.status(400).json({message:'Project users getting error'});
        }
    }
    async getPersonalTasks(req, res){
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.sendStatus(401);
            }
            jwt.verify(token, config.secret, async (err, decoded) => {
                if (err) {
                    console.log(err);
                    return res.status(401).json({error: 'Unauthorized'});
                }
                const userId = decoded.id;
                const projectId = req.body.value;
                const project = await Project.findOne({ _id: projectId });
                const projTasks = project.tasks;
                const tasks = await Task.find({ developers: { $in: [userId] }, _id: { $in: projTasks } });
                return res.json(tasks);
            });
        }catch (e){
            console.log(e);
            res.status(400).json({message:'Project users getting error'});
        }
    }

    async createTask(req, res){
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.sendStatus(401);
            }
            jwt.verify(token, config.secret, async (err, decoded) => {
                if (err) {
                    console.log(err);
                    return res.status(401).json({error: 'Unauthorized'});
                }
                const projectId = req.body.project.value;
                const project = await Project.findById(projectId);
                const {taskName, developers, deadline, description} = req.body;

                const newTask = new Task({taskName:taskName, developers: developers, deadline: deadline, status:'1', description:description});
                await newTask.save();
                project.tasks.push(newTask._id);
                await project.save();
                //res.status(200).json({ message: 'Задача успешно создана!' });
                return res.json(newTask);

            });
        }catch (e){
            console.log(e);
            res.status(400).json({message:'Tasks getting error'});
        }

    }

}
module.exports = new authController();