//Покдлючаем sqlite 
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./dba.db'); //Файл с базой данных

module.exports = {
    //ПРОВЕРКА ВХОДА
    checkSignIn : function(req, res, next){ 
    	 if(req.session.hash){
        db.all("SELECT *, COUNT (*) AS count FROM sessions WHERE hash = ? ",[req.session.hash], function(err, row) {
            console.log(row[0].iduser);
            if(row[0].count == 1){ 
            	 db.all("SELECT *  FROM users WHERE id = ?",[row[0].iduser],function(err, rows) {
                if(err){  
                    console.log(err);
                    var err = new Error("Ошибка базы данных");
                    res.render("login.hbs",{ error:"Ошибка базы данных"});
                }else{
                    console.log(rows);
                    var obj = {name:rows[0].name,perm:"Пользователь"};
                    if(rows[0].perm == 1) obj.perm = "Администратор";
                    req.obj = obj;
                    next(); 
                }     
                });    
    } else {
       var err = new Error("Sessions not found");
       console.log(req.session.user);
       res.render("login.hbs",{ error:"Сессия не найдена, войдите заново"});
    }
});
}else{
    var err = new Error("Null sessions");
    console.log(req.session.user);
    res.render("login.hbs");
}
    },
    authSignIn:function(request, response){
    	 return new Promise(function(resolve, reject) {
    	 	 db.all("SELECT * , COUNT (*) AS count FROM users WHERE login = ? and pass = ?",[request.body.username, request.body.password], function(err, row) {
        console.log(row);
        if(row[0].count == 1){
            var hash = generate(12);
            db.all("Insert into sessions(iduser,hash) values(?,?)",[row[0].id, hash],function(err, rows) {
                if(err){  
                    console.log(err);
                }else{
                    console.log(row);
                    resolve({status:"success", msg:"",shash: hash});
                }     
                });
        }else{
           reject({status:"error", msg:"Данные для входа не верны или не найдены"});
        }
    	 	});
    	 	});
    }
}


//Генерация хеша
function generate(len){ 
    	var ints =[0,1,2,3,4,5,6,7,8,9]; 
   var chars=['a','b','c','d','e','f','g','h','j','k','l','m','n','o','p','r','s','t','u','v','w','x','y','z'];
    var out='';
    for(var i=0;i<len;i++){
        var ch=Math.random(1,2);
        if(ch<0.5){
           var ch2=Math.ceil(Math.random(1,ints.length)*10);
           out+=ints[ch2];
        }else{
           var ch2=Math.ceil(Math.random(1,chars.length)*10);
           out+=chars[ch2];            
        }
    }
    return out;
    }