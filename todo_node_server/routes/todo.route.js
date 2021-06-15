var router = require('express').Router();

//http://localhost:3000/api/todos       GET
//http://localhost:3000/api/todos       POST
//http://localhost:3000/api/todos/1     PUT
//http://localhost:3000/api/todos/1     PATCH
//http://localhost:3000/api/todos/1     DELETE

// router.use() - we can apply middleware only for this module

var todos = [];

router.get('/', function(req,res){
    res.json(todos);
});

router.post('/', function(req,res){
    var todo = {...req.body, id:getNextId()}    
    todos.push(todo)
    res.send(todos);
});

function getNextId(){
    return todos.length == 0 ? 1: todos[todos.length-1].id +1;
}

//for retrieving query param use :<varname lets say :id
//http://localhost:3000/api/todos/1
router.put('/:id',function(req,res){
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
router.patch('/:id',function(req,res){
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
router.delete('/:id',function(req,res){
    var {id} = req.params;
    todos = todos.filter(todo => todo.id != id)
    return res.json(todos)

});

module.exports =router;