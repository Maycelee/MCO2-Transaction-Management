

const controller = {

    getFavicon: function (req, res) {
        res.status(204);
    },

    getIndex: function (req, res) {
        

        res.render('main');



        var ping = require('ping');
        var host2 = ['178.128.223.106', '139.59.252.54', '167.71.211.20'];
        var frequency = 5000; //ping every 5 seconds      

        host2.forEach(function(host){
            setInterval(function() {
                ping.sys.probe(host, function(active){
                    var info = active ? 'IP ' + host + ' = Active' : 'IP ' + host + ' = Non-Active';
            
                    if(active == 1){
                        console.log(info)
                    }
                });
            }, frequency);
        });
    }
}

module.exports = controller;