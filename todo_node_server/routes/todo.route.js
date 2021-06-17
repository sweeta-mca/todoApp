var router = require('express').Router();
const { copyFileSync } = require('fs');
const { get } = require('http');
var path = require('path');
var {getFileContent, writeFileContent} = require('../utils/file.util');

// refactoring all the callbacks into promises

//http://localhost:3000/api/todos       GET
//http://localhost:3000/api/todos       POST
//http://localhost:3000/api/todos/1     PUT
//http://localhost:3000/api/todos/1     PATCH
//http://localhost:3000/api/todos/1     DELETE

// router.use() - we can apply middleware only for this module

var filename = path.join(__dirname,'..','db','todo.db.json');

function getNextId(){
    return getFileContent(filename)
    .then(parsedData => {
        return {
            id:parsedData.length == 0 ? 1: parsedData[parsedData.length-1].id +1,
            todos:parsedData
        };
    })
    .catch(err => {
        console.log(err);
    });
     
}

router.get('/', function(req,res){ 
    getFileContent(filename)
    .then(data => res.json(data))   
    .catch(err => console.log(err));    
});

router.post('/', function(req,res){
    var _id,todos;
    getNextId()
    .then(data =>{
        _id = data.id;
        todos = data.todos;
    })
    .then(_ => {
        var todo = {...req.body,id:_id};
        todos.push(todo); 
        return writeFileContent(filename,todos);      
    })
    .then(data => res.json("post created"))
    .catch(err => console.log(err));    
});

//for retrieving query param use :<varname lets say :id
//http://localhost:3000/api/todos/1
router.put('/:id',function(req,res){
    var {id} = req.params;
    var updatedObj = req.body;    
    var _idx,_todos;
    getFileContent(filename)
    .then(todos => {
        _todos = todos;
        return _todos.findIndex(todo => todo.id == id)
    })
    .then(idx => {
        _idx = idx;
        return (idx != -1)
    })
    .then(isPresent => {
        if(isPresent){
            _todos[_idx] = {...updatedObj,id:parseInt(id)};
            return writeFileContent(filename,_todos);
        }
        else{
            return {
                success : false,
                msg:"Id is not present"
            };
        }
    })
    .then(data => res.json(data))
    .catch(err => console.log(err))

    });
    
//http://localhost:3000/api/todos/1     PATCH
router.patch('/:id',function(req,res){
    var {id} = req.params;
    var updatedObj = req.body;
    var _idx,_todos;
    getFileContent(filename)
    .then(data => {
        _todos = data;
        return _todos.findIndex(todo => todo.id == id);
    })
    .then(idx => {
        _idx = idx;
        return (idx!=-1);
    })
    .then(isPresent =>{
        if(isPresent){
            _todos[_idx] = {..._todos[_idx], ...updatedObj, id:parseInt(id)};
            return writeFileContent(filename,_todos);
        }
        else {
            return {
                success : false,
                msg:"Id is not present"
            }
        }
    })
    .then(data => res.json(data))
    .catch(err =>  console.log(err));
           
});

//http://localhost:3000/api/todos/1     DELETE
router.delete('/:id',function(req,res){
    var {id} = req.params;
    getFileContent(filename)
    .then(todos => {
        todos = todos.filter(todo => todo.id!=id);
        return writeFileContent(filename,todos);
    })
    .then(_ => res.json("Deleted"))
    .catch(err => console.log(err));
});

module.exports =router;