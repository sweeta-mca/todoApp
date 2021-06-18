var router = require('express').Router();
const { copyFileSync } = require('fs');
const { get } = require('http');
var path = require('path');
var {getFileContent, writeFileContent} = require('../utils/file.util');

// refactoring all the promises into async and await

//http://localhost:3000/api/todos       GET
//http://localhost:3000/api/todos       POST
//http://localhost:3000/api/todos/1     PUT
//http://localhost:3000/api/todos/1     PATCH
//http://localhost:3000/api/todos/1     DELETE

// router.use() - we can apply middleware only for this module

var filename = path.join(__dirname,'..','db','todo.db.json');

async function getNextId(){
    var parsedData = await getFileContent(filename);
    return {
        id:parsedData.length == 0 ? 1: parsedData[parsedData.length-1].id +1,
        todos:parsedData
    };
}

router.get('/', async function(req,res){ 
    var data = await getFileContent(filename);
    res.json(data);  
});

router.post('/', async function(req,res){    
    var {id,todos} = await getNextId();    
    var todo = {...req.body,id:id};
    todos.push(todo); 
    await  writeFileContent(filename,todos);      
    res.json(todos);
});

//for retrieving query param use :<varname lets say :id
//http://localhost:3000/api/todos/1
router.put('/:id',async function(req,res){
    var {id} = req.params;
    console.log(id)
    var updatedObj = req.body;    
    var todos  = await getFileContent(filename);    
    var idx = todos.findIndex(todo => todo.id == id);
    if(idx !=-1){
        console.log(idx)
        todos[idx] = {...updatedObj,id:parseInt(id)};
        var data = await writeFileContent(filename,todos);
        res.json(data);        
    }
    else{
        res.json("Id is not present")
    } 
});
    
//http://localhost:3000/api/todos/1     PATCH
router.patch('/:id', async function(req,res){
    var {id} = req.params;
    var updatedObj = req.body;
    var todos = await getFileContent(filename);
    var idx = todos.findIndex(todo => todo.id == id);
    if(idx != -1){
        todos[idx] = {...todos[idx], ...updatedObj, id:parseInt(id)};
        var data = await writeFileContent(filename,todos);
        res.json(data);
    }
    else {
        res.json("Id is not present");    
    }      
});

//http://localhost:3000/api/todos/1     DELETE
router.delete('/:id',async function(req,res){
    var {id} = req.params;
    var todos = await getFileContent(filename);
    todos = todos.filter(todo => todo.id!=id);
    var data = await writeFileContent(filename,todos);
    res.json("Deleted");
});

module.exports =router;