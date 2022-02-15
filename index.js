const express = require('express');
const hbs = require('hbs');
const routes = require('./routes/routes.js');
const db = require('./models/db.js');

const app = express();
const port = 9090;

app.set('view engine', 'hbs');
//hbs.registerPartials(__dirname + '/views/partials');

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/', routes);

app.use(function (req, res) {
    res.render('error');
});

app.listen(port, function () {
    console.log('Server is listening, access through localhost:' + port);
});


var ping = require('ping');
var host2 = ['178.128.223.106', '139.59.252.54', '167.71.211.20'];
var frequency = 5000; //ping every 5 seconds      
var isAct = [0,0,0];
var ischanged = 0;
var loaded = 1;

host2.forEach(function(host){
    setInterval(function() {
        ping.sys.probe(host, function(active){
            var info = active ? 'IP ' + host + ' = Active' : 'IP ' + host + ' = Non-Active';
                if(host == host2[0]){
                    if(active == 1){
                        if(isAct[0] != 0 && isAct[0] != 1)
                            ischanged = 1;
                        isAct[0] = 1;
                    }
                    else{
                        if(isAct[0] != 0 && isAct[0] != -1)
                            ischanged = 1;
                        isAct[0] = -1;
                    }   
                }
                if(host == host2[1]){
                    if(active == 1){
                        if(isAct[1] != 0 && isAct[1] != 1)
                            ischanged = 1;
                        isAct[1] = 1;
                    }
                    else{
                        if(isAct[1] != 0 && isAct[1] != -1)
                            ischanged = 1;
                        isAct[1] = -1;
                    }   
                }
                if(host == host2[2]){
                    if(active == 1){
                        if(isAct[2] != 0 && isAct[2] != 1)
                            ischanged = 1;
                        isAct[2] = 1;
                    }
                    else{
                        if(isAct[2] != 0 && isAct[2] != -1)
                            ischanged = 1;
                        isAct[2] = -1;
                    }   
                }
                //console.log(info);
            });
            if(loaded || ischanged){
                if(ischanged == 1)
                    console.log("Reloaded database due to changes");
                db.connect();
                loaded = 0;
                ischanged = 0;
            }
    }, frequency);
});