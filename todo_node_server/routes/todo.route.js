var router = require('express').Router();
var path = require('path');
var {getFileContent, writeFileContent} = require('../utils/file.util');

//http://localhost:3000/api/todos       GET
//http://localhost:3000/api/todos       POST
//http://localhost:3000/api/todos/1     PUT
//http://localhost:3000/api/todos/1     PATCH
//http://localhost:3000/api/todos/1     DELETE

// router.use() - we can apply middleware only for this module

var filename = path.join(__dirname,'..','db','todo.db.json');

function getNextId(cb){
    getFileContent(filename,function(err,todos){
        if(err) cb(err);
        return cb(null,todos.length == 0 ? 1: todos[todos.length-1].id +1,todos); 
    });    
}

router.get('/', function(req,res){    
    getFileContent(filename,function(err,todos){
        if(err) throw err;
        res.json(todos);
    });
});

router.post('/', function(req,res){
    var idx;
    getNextId(function(err,id,todos){
        if(err) throw err;
        var todo = {...req.body, id:id}   
        todos.push(todo); 
        writeFileContent(filename,todos,function(err,data){
            if(err) throw err;
            res.send("created");
        });
    });    
});

//for retrieving query param use :<varname lets say :id
//http://localhost:3000/api/todos/1
router.put('/:id',function(req,res){
    var {id} = req.params;
    var updatedObj = req.body;
    getFileContent(filename,function(err,todos){
        var idx = todos.findIndex(todo => todo.id == id);
        if(idx!=-1){
            todos[idx] = {...updatedObj,id:parseInt(id)}
            writeFileContent(filename,todos,function(err,data){
                if(err)  throw err;                
                res.json({...updatedObj,id:parseInt(id)})
            });
        }
        else{
            return res.json({
                msg:"Todo with specified id doesnot exist"
            });
        }       
    });
    

    });
    
//http://localhost:3000/api/todos/1     PATCH
router.patch('/:id',function(req,res){
    var {id} = req.params;
    var updatedObj = req.body;
    getFileContent(filename,function(err,todos){
        var idx = todos.findIndex(todo => todo.id == id);
        if(idx!=-1){
            todos[idx] = {...todos[idx], ...updatedObj, id:parseInt(id)};
            writeFileContent(filename,todos,function(err,data){
                if(err) throw err;
                return res.json({...todos[idx], ...updatedObj, id:parseInt(id)})
            });        
        }
        else{
            return res.json({
                msg:"Todo with specified id doesnot exist"
        });
        }   
    });    
})

//http://localhost:3000/api/todos/1     DELETE
router.delete('/:id',function(req,res){
    var {id} = req.params;
    getFileContent(filename,function(err,todos){
        todos = todos.filter(todo => todo.id != id)
        writeFileContent(filename,todos,function(err,data){
            if(err) throw err;
            return res.json("Deleted");
        });
    });
});

module.exports =router;