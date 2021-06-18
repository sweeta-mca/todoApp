var fs = require('fs').promises;

exports.getFileContent = async function(filename)
{
    var data = await fs.readFile(filename);
    return JSON.parse(data.toString()); 
}
  
exports.writeFileContent = async function(filename,data)
{
    await fs.writeFile(filename,JSON.stringify(data));
    return 'Created';
}