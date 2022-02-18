const fs = require('fs');


const file = {
    writeNode1: function(query){
        var stream = fs.createWriteStream("public/node1.txt", {flags:'a'});
        stream.write(query + "\n");
        console.log(new Date().toISOString());
    },

    writeNode2: function(query){
        var stream = fs.createWriteStream("public/node2.txt", {flags:'a'});
        stream.write(query + "\n");
        console.log(new Date().toISOString());
    },

    writeNode3: function(query){
        var stream = fs.createWriteStream("public/node3.txt", {flags:'a'});
        stream.write(query + "\n");
        console.log(new Date().toISOString());
    },

    readNode1: function(callback){
        var result = fs.readFileSync("public/node1.txt");
        var output = result.toString();
        
        return callback(output);
    },
    readNode2: function(callback){
        var result = fs.readFileSync("public/node2.txt");
        var output = result.toString();
        
        return callback(output);
    },
    readNode3: function(callback){
        var result = fs.readFileSync("public/node3.txt");
        var output = result.toString();
        
        return callback(output);
    },

    clearNodes1: function(){
        fs.writeFile("public/node1.txt", '', function(){console.log('Cleared node 1 query backlog')});
    },

    clearNodes2: function(){
        fs.writeFile("public/node2.txt", '', function(){console.log('Cleared node 2 query backlog')});
    },

    clearNodes3: function(){
        fs.writeFile("public/node3.txt", '', function(){console.log('Cleared node 3 query backlog')});
    }
}

module.exports= file;