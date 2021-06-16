var fs = require('fs');

exports.getFileContent = function(filename,cb)
{
    fs.readFile(filename, function(err,data){
        if(err) return cb(err,null);
        return cb(null,JSON.parse(data.toString()));
    }); 
}

exports.writeFileContent = function(filename,data,cb)
{
    fs.writeFile(filename,JSON.stringify(data),function(err){

        if(err) cb(err,null);
        return cb(null,"Done");
    })
}