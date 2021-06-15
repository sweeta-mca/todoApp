// Fake json server url
//const ENDPOINT_URL = "http://localhost:3001/todos/";

// Node-Express server url
const ENDPOINT_URL = "http://localhost:3000/api/todos/"

/**
 * Function to fetch all todos available
 * @returns promise wrapped with list of all todos
 */
function getTodos(){
    return fetch(ENDPOINT_URL)
    .then(response => response.json())
    .then(result => result)
    .catch(err => err);
}

/**
 * Function to create new todo
 * @param {Object} todo 
 * @returns promise wrapped with newly created todo
 */
function createTodo(todo)
{
    return fetch(ENDPOINT_URL,
    {
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(todo)  
    })
    .then(response => response.json())
    .then(result => result)
    .catch(err=> err);
}

/**
 * Function to fetch a todo object
 * @param {string} id - The Id of todo
 * @returns promise wrapped with fetched todo
 */
function fetchTodo(id){
    let url = ENDPOINT_URL+id;
    return fetch(url)
    .then(response => response.json())
    .then(result => result)
    .catch(err => err);
}

/**
 * Updates given todo object
 * @param {Object} todo 
 * @returns promise wrapped with updated todo object
 */
function updateTodo(todo)
{
   
    let url = ENDPOINT_URL+todo.id;
    
    return fetch(url,
    {
        method:"PUT",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(todo)  
    })
    .then(response => response.json())
    .then(result => result)
    .catch(err=> err);
}

/**
 * Function to delete todo for given id
 * @param {String} id 
 * @returns 
 */
function deleteTodo(id)
{
    let url = ENDPOINT_URL+id;
    return fetch(url,{
        method:"DELETE"
    })
    .then(res => res.json())
    .then(result => result)
    .catch(err => err);
}