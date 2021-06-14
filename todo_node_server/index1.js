const express = require('express');

var app = express();
var todos =[];

//http://localhost:3000/api/todos GET
//http://localhost:3000/api/todos POST
//http://localhost:3000/api/todos/1 PUT
//http://localhost:3000/api/todos/1 PATCH
//http://localhost:3000/api/todos/1 DELETE

/**
// way -1
app.use(function(req,res,next){
    console.log("crossing middleware")
    if(req.method !== "GET"){        
        req.on('data', (data)=>{
            req.body  = JSON.parse(data.toString());                        
            next();
        });
    }else{
        next();
    }
   
});
 */

app.use(express.json) // application/json : extract request body for json type content same like way-1
app.use(express.urlencoded) // x-www-form-encoded

app.get('/api/todos', function(req,res){
    console.log("get method")
    res.json(todos);
});
app.post('/api/todos', (req,res)=>{
    //create id
    // push new todo into todos
    // send todos in response
    
    res.send(req.body)
    
});
//http://localhost:3000/api/todos/1
app.put('/api/todos/:id', function(req,res){

});
app.patch('/api/todos/:id',function(req,res){
    
});
app.delete('/api/todos/:id',function(req,res){
    
});




app.listen(3000);