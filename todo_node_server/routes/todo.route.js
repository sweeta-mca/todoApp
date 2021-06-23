var router = require('express').Router();
const { copyFileSync } = require('fs');
const { get } = require('http');
var path = require('path');
var {getFileContent, writeFileContent} = require('../utils/file.util');
const{InternalServerError, BadRequestError, CustomError}= require('../utils/Error');

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

router.get('/', async function(req,res,next){ 
    try {
        var data = await getFileContent(filename);
        res.json(data);
    } catch (error) {
        next(new InternalServerError("Something is went wrong"));
    }      
});

router.post('/', async function(req,res,next){    
    try
    {
        var {id,todos} = await getNextId();    
        var todo = {...req.body,id:id};
        todos.push(todo); 
        await  writeFileContent(filename,todos);      
        res.json(todos);
    }
    catch(error)
    {
        next(new InternalServerError("Something is went wrong"));
    }
});

//for retrieving query param use :<varname lets say :id
//http://localhost:3000/api/todos/1
router.put('/:id',async function(req,res,next){
    try {
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
            next(new BadRequestError("Id is not present")); 
        } 
    } 
    catch (error) {
        next(new InternalServerError("Something is went wrong"));
    }
});
    
//http://localhost:3000/api/todos/1     PATCH
router.patch('/:id', async function(req,res,next){
    try {
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
            next(new BadRequestError("Id is not present")); 
        } 
    } catch (error) {
        next(new InternalServerError("Something is went wrong"));
    }     
});

//http://localhost:3000/api/todos/1     DELETE
router.delete('/:id',async function(req,res,next){
    try {
        var {id} = req.params;
        var todos = await getFileContent(filename);
        var newTodos = todos.filter(todo => todo.id!=id);
        if(todos.length == newTodos.length)
        {
            // no todo has been deleted and stop execution and give a 400 Bad request 
            next(new BadRequestError("No Todo is present"));
        }
        var data = await writeFileContent(filename,todos);
        res.json("Deleted");
    } catch (error) {
        next(new InternalServerError("Something went wrong"))
    }
});

module.exports =router;