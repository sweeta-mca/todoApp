const express = require('express');
const cors = require('cors');

app =express();

const todoRoute = require('./routes/todo.route');

app.use(express.json()); // middleware common for all 
app.use(cors())

app.use('/api/todos',todoRoute);


app.listen(3000, ()=>{
    console.log("Server Started Successfully at port 3000");
});