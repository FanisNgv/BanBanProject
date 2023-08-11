const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {check} = require("express-validator");
const authMiddleware = require('./Middleware/authMiddleware')
const roleMiddleware = require('./Middleware/roleMiddleware')

router.post('/registration',[
    check('firstName', "Фамилия пользователя не может быть пустым!").notEmpty(),
    check('lastName', "Имя пользователя не может быть пустым!").notEmpty(),
    check('email', "Почта не может быть пустым!").notEmpty(),
    check('password', "Пароль должен содержать не менее 4-ех и не более 10-и символов!").isLength({min:4, max:10}),
    check('role', "Вы не выбрали роль!").notEmpty()
], controller.registration);
router.post('/login', controller.login);
router.get('/user', controller.getUser);
router.get('/projects', controller.getProjects);
router.post('/createProject', controller.createProject);
router.post('/getProjectInfo', controller.getProjectInfo);
router.get('/getDevelopers', controller.getDevelopers);
router.post('/createTask', controller.createTask);
router.post('/getProjDevs', controller.getProjDevs);
router.post('/getTasks', controller.getTasks);
router.post('/getPersonalTasks', controller.getPersonalTasks);
router.post('/getPersonalTasksAsTml', controller.getPersonalTasksAsTml);
router.post('/getTask', controller.getTask);
router.put('/updateTask', controller.updateTask);
router.put('/updateTaskGlobally', controller.updateTaskGlobally);
router.put('/updateProject', controller.updateProject);
router.post('/deleteTask', controller.deleteTask);

module.exports = router;