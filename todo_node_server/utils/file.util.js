var fs = require('fs').promises;

exports.getFileContent = function(filename)
{
    return fs.readFile(filename)
    .then(data => JSON.parse(data.toString())); 
}
  
exports.writeFileContent = function(filename,data)
{
    return fs.writeFile(filename,JSON.stringify(data))
    .then(_ => 'Created');
}