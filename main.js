//Подключение вспомогательного модуля
var ad = require("./addon.js");
// подключение express
const express = require("express");
//Подключение библиотеки парсера body
const bodyParser = require("body-parser");
//Подключение библиотеки шаблонизатора
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
// создаем объект приложения
const app = express();
//Парсер json express
const jsonParser = express.json();
// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});
//Контроль доступа
var session = require('express-session');//Библиотека для сессий
app.use(session({secret: "1mpulse"}));
//Устанавливаем шаблонизатор
// устанавливаем настройки для файлов layout
app.engine("hbs", expressHbs(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
//Устанавливаем статические файлы
app.use(express.static(__dirname + "/public"));

app.get("/login", function(request, response){
    response.render("login.hbs");
    // отправляем ответ
   // response.send("<h2>Привет Express!</h2>");
});

app.post("/auth", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    ad.authSignIn(request, response).then(
    result => {
      request.session.hash = result.shash;
       response.send(result);
    },
    error => {
      response.send(error);
    }
  );
   // console.log(request.body);
   // response.send("success");
});
app.get('/logout', function(req, res){
    req.session.destroy(function(){
       console.log("user logged out.")
    });
    res.redirect('/login');
 });
 // определяем обработчик для маршрута "/news"
 app.get("/news",ad.checkSignIn, function(request, response,next){
  // response.render("test.hbs");
   // отправляем ответ
   console.log(request.obj);
   response.render("news.hbs",{username:request.obj.name,status:request.obj.perm});
});
// определяем обработчик для маршрута "/"
app.get("/",ad.checkSignIn, function(request, response,next){
    // response.render("test.hbs");
     // отправляем ответ
     response.redirect('/news');
    // console.log(request.obj);
    // response.render("index.hbs",{username:request.obj.name,status:request.obj.perm});
 });
 app.use(function(req, res, next) {
    res.status(404).send('Моя твоя не понимать - 404');
  });

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);