const { json } = require('express');
const express = require('express');

const app = express();


//http://localhost:3000/api/todos       GET
//http://localhost:3000/api/todos       POST
//http://localhost:3000/api/todos/1     PUT
//http://localhost:3000/api/todos/1     PATCH
//http://localhost:3000/api/todos/1     DELETE

var todos = [];

app.use(express.json());

app.get('/api/todos', function(req,res){
    res.json(todos);
});

app.post('/api/todos', function(req,res){
    var todo = {...req.body, id:getNextId()}    
    todos.push(todo)
    res.send(todos);
});

function getNextId(){
    return todos.length == 0 ? 1: todos[todos.length-1].id +1;
}

//for retrieving query param use :<varname lets say :id
//http://localhost:3000/api/todos/1
app.put('/api/todos/:id',function(req,res){
    var {id} = req.params;
    var updatedObj = req.body;
    var idx = todos.findIndex(todo => todo.id == id);
    if(idx!=-1){
        todos[idx] = {...updatedObj,id:id}
        return res.send({...updatedObj,id:id})
    }
    else{
        return res.json({
            msg:"Todo with specified id doesnot exist"
        });
    }
});

//http://localhost:3000/api/todos/1     PATCH
app.patch('/api/todos/:id',function(req,res){
    var {id} = req.params;
    var updatedObj = req.body;
    console.log(updatedObj)
    var idx = todos.findIndex(todo => todo.id == id);
    if(idx!=-1){
        todos[idx] = {...todos[idx],...updatedObj,id:id}
        return res.send({...todos[idx],...updatedObj,id:id})
    }
    else{
        return res.json({
            msg:"Todo with specified id doesnot exist"
        });
    }
})

//http://localhost:3000/api/todos/1     DELETE
app.delete('/api/todos/:id',function(req,res){
    var {id} = req.params;
    todos = todos.filter(todo => todo.id != id)
    return res.json(todos)

});

app.listen(3000, ()=>{
    console.log("Server Started Successfully at port 3000");
});