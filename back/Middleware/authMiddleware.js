const {secret} = require('../config')
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.cookies.token; // получаем токен из cookie

    // проверяем наличие токена
    if (!token) {
        res.redirect('/login');
        return;
    }

    try {
        const decoded = jwt.verify(token, secret); // декодируем токен
        req.user = decoded; // добавляем информацию о юзере в объект запроса
        next(); // продолжаем выполнение запроса
    } catch (err) {
        res.redirect('/login');
    }
}

module.exports = authMiddleware;