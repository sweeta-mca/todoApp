
//@Get  http://localhost:3001/todos
//@POST http://localhost:3001/todos/ {data}
//@PATCH http://localhost:3001/todos/{id} {data}    - update the data which needs change, not overwite other
//@PUT http://localhost:3001/todos/{id}             - overwrite all the data for the {id}
//@DELETE http://localhost:3001/todos/{id}

let todos = [];
let isEdit = false;
let editId =0;
let isActiveChecked =false;
let isCompletedChecked =false;

const ACTIVE = "Active";
const COMPLETED = "Completed";

const todoForm = document.querySelector("#todoForm")
const todo_list = document.querySelector(".todo_list");
const btnAdd = document.querySelector("#btnAdd");
const title = document.querySelector("#title");
const desc = document.querySelector("#desc");

let show_active = document.querySelector("#show_active");
let show_completed = document.querySelector("#show_completed");


btnAdd.addEventListener('click',()=>{
    var form = new FormData(todoForm);
    var formValues = {};
        
    for(var val of form.keys())
    {
        formValues[val] = form.get(val);
    }

    if(formValues.title.length>0 && formValues.desc.length>0)
    {
        if(isEdit){ 
            let todo;
            fetchTodo(editId)
            .then(data =>{
                todo= data;
                todo.title = formValues.title;
                todo.description=formValues.desc;        
                updateTodo(todo).then(data => {
                    todos.splice(todos.findIndex(t=> t.id == data.id),1,data);
                    renderTodos(todos);
                });         
            })
            .catch(err=>console.log(err));
            toggleAddTodo();
        }
        else{
            var todo = getTodo(formValues.title,formValues.desc);   
            createTodo(todo).then(data => {
                todos = [...todos,todo];
                renderTodos(todos);
            });
        }
        
        title.value = null;
        desc.value = null;
    }
        
});

show_active.addEventListener("click",()=>{
    isActiveChecked =!isActiveChecked;
    showStausBasedTodos();
});

show_completed.addEventListener("click",(ev)=>{   
    isCompletedChecked =!isCompletedChecked;
    showStausBasedTodos();
});


// Function to create new Todo
function getTodo(title,desc){
    var id = todos.length >0 ? todos[todos.length-1].id+1 : 1;

    return{
        id:id,
        title:title,
        description:desc,
        status:'Active',
        createdDate:new Date()
    };
}

function toggleEdit(id){
    isEdit = true;
    editId = id;
    btnAdd.value = "Save";
}

function toggleAddTodo(){
    editId=null;
    isEdit =false;
    btnAdd.value ="Add Todo";
}

function showStausBasedTodos(){
    var filteredList =[];
    if(isActiveChecked && isCompletedChecked==false)
    {
        filteredList = todos.filter(t=>t.status == ACTIVE)
    }
    else if(isCompletedChecked && isActiveChecked==false)
    {
        filteredList = todos.filter(t=>t.status == COMPLETED)
    }
    else
    {
        filteredList = todos;
    }
    renderTodos(filteredList);    
}

function renderTodos(todoList){
    todo_list.innerHTML = null;
    var todoRows = todoList.map(t => createRow(t));

    todoRows.forEach(row => {
        todo_list.appendChild(row);
    });
    
}


function render()
{
    getTodos().then(data => {
        todos = data;
        renderTodos(todos)    
        refreshCheckBoxControls();
    });
}

function createRow(todo){
    
    var mainrow = document.createElement("div");
    mainrow.className ="row bg-light border p-3 mb-2";
    
    var titleCol = document.createElement("div");
    titleCol.className="col-md-2";
    titleCol.textContent=todo.title;

    var descCol = document.createElement("div");
    descCol.className="col-md-2";
    descCol.textContent = todo.description;

    var statusCol = document.createElement("div");
    statusCol.className="col-md-2";
    statusCol.textContent = todo.status;

    mainrow.appendChild(titleCol);
    mainrow.appendChild(descCol);
    mainrow.appendChild(statusCol);

    var actionBtnCol = document.createElement("div");
    actionBtnCol.className="col-md-6";

    var actionBtn = document.createElement("button");
    actionBtn.className ="btn btn-info me-3";
    actionBtn.textContent="Mark Completed";
    
    actionBtn.addEventListener('click',(ev) =>{        
        todo.status = COMPLETED;
        updateTodo(todo).then(data => {
            todos.splice(todos.findIndex(t=> t.id == data.id),1,data);
            renderTodos(todos);
        });
    });

    if(todo.status == COMPLETED)
    {
        disableBtn(actionBtn);
    }
    actionBtnCol.appendChild(actionBtn);

    actionBtn = document.createElement("button");
    actionBtn.className ="btn btn-primary me-3";
    actionBtn.textContent="Edit";
    actionBtn.addEventListener('click',() =>{
        title.value = todo.title;
        desc.value = todo.description;        
        toggleEdit(todo.id);
    });

    actionBtnCol.appendChild(actionBtn);

    actionBtn = document.createElement("button");
    actionBtn.className ="btn btn-danger me-3";
    actionBtn.textContent="Delete";
    actionBtn.addEventListener('click',() =>{
        deleteTodo(todo.id).then(data => {
            todos.splice(todos.findIndex(t=> t.id == data.id),1);
            renderTodos(todos);
        });
    });

    actionBtnCol.appendChild(actionBtn);    
    mainrow.appendChild(actionBtnCol); 
    
    return mainrow;
}

// To update the check box controls
function refreshCheckBoxControls(){   

    if(todos.length>0)
    {
        show_active.removeAttribute("disabled");
        show_completed.removeAttribute("disabled");
    }
    else{
        show_active.setAttribute("disabled","disabled");
        show_completed.setAttribute("disabled","disabled");
    }
}

function disableBtn(btn){
    btn.disabled =true;
}

render();