const btnAdd = document.querySelector('.button-add');
const taskList = document.querySelector('.task-list ul');
const inputField = document.querySelector('#input-field');

// Making a GET request with Fetch API
let tasks = [];

const getTasks = async() => {
    try {
        const res = await fetch('https://js1-todo-api.vercel.app/api/todos?apikey=5a91669d-78df-43e2-8558-702a1e63af19') // Initiates the GET request to the specified URL. res waits for the url fetch and if promise goes well will be contained in res

        if(res.status !== 200) { // ERROR HANDLING: Checks if response status is successfull
            throw new Error('Something went wrong when fetching tasks, status: ' + res.status);
        }

        const data = await res.json() // waits for the url fetch json and if promise goes well will be contained in data

        tasks = data; // Assigning tasks to data

        taskList.innerHTML = '';
        
        tasks.forEach(task => {  // Displaying tasks by iterating through task list
            const newTodoItem = document.createElement('li');
            newTodoItem.classList.add('md:text-base', 'md:pl-32', 'pl-12', 'text-sm', 'font-medium');
            newTodoItem.innerText = task.title;
            taskList.appendChild(newTodoItem);

            // Creating trashcan to display next to task
                const trashCan = document.createElement('i');
                trashCan.classList.add('fa-regular', 'fa-trash-can', 'pl-4', 'md:pl-14');
                trashCan.setAttribute('id', task._id)

                const showTrashCan = () => {
                    newTodoItem.appendChild(trashCan);
                    trashCan.style.display= 'inline-block';
                }

                trashCan.addEventListener('click', async () => {
                    await deleteTask(task._id)
                })


                const hideTrashCan = () => {
                    newTodoItem.appendChild(trashCan);
                    trashCan.style.display= 'none';
                }

                hideTrashCan(); //  Hide trash can on default

                newTodoItem.addEventListener('mouseover', showTrashCan);
                newTodoItem.addEventListener('mouseout', hideTrashCan);
            })
}
    catch(err) {
        console.log(err)
    }
};

// Call the getTasks function to fetch and display the data
getTasks();

// Making a POST request
const addTask = async() => {
        const res = await fetch('https://js1-todo-api.vercel.app/api/todos?apikey=5a91669d-78df-43e2-8558-702a1e63af19', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                'title': inputField.value,
            })
        })

        const errorActive = hasError(inputField);
        if(errorActive === true) {
            console.log('Something went wrong when adding task, status: ' + res.status);
        }
        const data = await res.json()
        tasks.push(data);
}

// Add task to database by calling addTask()
inputField.addEventListener('submit', async(event) => {
    event.preventDefault()
    await addTask();
    getTasks();
});


// Making a DELETE request
const deleteTask = async(id) => {
    try {
        const res = await fetch(`https://js1-todo-api.vercel.app/api/todos/${id}?apikey=5a91669d-78df-43e2-8558-702a1e63af19`, {
            method: 'DELETE'
        })

        if(res.status !== 200) { // ERROR HANDLING: Checks if response status is successfull
            throw new Error('Something went wrong when deleting task, status: ' + res.status);
        }

        const data = await res.json()
        console.log(data)
        // e.target.remove()
    }
    catch(err) {
        console.log(err)
    }
    getTasks()
}

// Add-button click events
inputField.addEventListener('submit', () => {
    let newTodoItem = document.createElement('li')
    newTodoItem.classList.add('md:text-base', 'md:pl-32', 'pl-12', 'text-sm', 'font-medium');
    newTodoItem.innerText = inputField.value;
    validateField(inputField);

    // Prevents new li elements from being created if inputfield is empty
    if(inputField.value.trim() !== '') {
        taskList.appendChild(newTodoItem);
    }

    // Clearing input field when new todo is added
    const returnValue = hasError(inputField);
    if(returnValue === false) {
        inputField.value = '';
    } 
});

// VALIDATING INPUT

// Checks if input is empty
function validateField(todoInput) {
    if(todoInput.value.trim() === '') {
        setError(todoInput);
    } else {
        setSuccess(todoInput);
    }
}

// Success handling
function setSuccess(todoInput) {
    todoInput.classList.remove('ring-red-400','placeholder:text-red-400', 'focus:ring-red-600');
    todoInput.classList.add('ring-gray-300', 'placeholder:text-gray-400', 'focus:ring-indigo-600');
    let parentDiv = todoInput.parentElement;
    // Remove the error message if it exists
    const inputErrorMsgId = getErrorMsgId(todoInput);
    const errorMsg = document.getElementById(inputErrorMsgId);
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Error handling
function setError(todoInput) {
    const inputErrorMsgId = getErrorMsgId(todoInput);

    todoInput.classList.remove('ring-gray-300', 'placeholder:text-gray-400', 'focus:ring-indigo-600');
    todoInput.classList.add('ring-red-400','placeholder:text-red-400', 'focus:ring-red-600');

    const errorMsg = `<p id="${inputErrorMsgId}" class="absolute text-xs text-red-400" style="transform: translate(5px, 5px);">Field can not be empty</p>`;
    todoInput.insertAdjacentHTML('afterend', errorMsg);
}

// Create unique ID for error message that is linked with input field
function getErrorMsgId(todoInput) {
    const inputId = todoInput.id;
    const inputErrorMsgId = inputId + 'error-msg-id';
    return inputErrorMsgId;
}

// Checks if there is an error msg for the input by looking for the ID assigned to the error msg
function hasError(todoInput) {
    const inputErrorMsgId = getErrorMsgId(todoInput);
    const errorMsg = document.getElementById(inputErrorMsgId);
    if(errorMsg !== null) {
        return true;
    } else {
        return false;
    }
}