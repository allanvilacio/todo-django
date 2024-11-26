const csrftoken = document.querySelector('[name="csrfmiddlewaretoken"]').value;
const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrftoken
};


const modalNewTodo = document.getElementById('modal-new-todo');
let modalmodalNewTodoBootstrap = null
if (modalNewTodo) {
    modalmodalNewTodoBootstrap = new bootstrap.Modal(modalNewTodo, { keyboard: true });
}



const modalUpdateTodo = document.getElementById('modal-update-todo');
let modalUpdateTodoBootstrap = null
if (modalUpdateTodo) {
    modalUpdateTodoBootstrap = new bootstrap.Modal(modalUpdateTodo, { keyboard: true });
}



function formatDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2,'0');
    let minutes = date.getMinutes().toString().padStart(2,'0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

async function getTodo() {
    path = window.location.pathname

    const response = await fetch('/list-todos/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            path: path
        })
    });

    const data = await response.json();
    return data
}

async function listTodos() {
    const response = await getTodo();

    const tbody = document.querySelector('#lista-todo');
    tbody.textContent = '';

    response['data'].forEach(todo => {

        let div = document.createElement('div');
        div.classList.add("d-flex", "list-group-item", "list-group-item-action", "justify-content-between", "rounded", "border-0", "border-bottom");

        div.ondblclick = function () { showModalUpdate(todo) }

        let dateEntregaFormat = new Date(todo.data_entrega)
        div.innerHTML = `
            <div>
                <div class="form-check">
                <input class="form-check-input" type="checkbox" ${todo.data_conclusao ? "checked" : ""} onclick="checkTodo(${todo.id})">
            </div>
            </div>
                <div class="w-100">
                <h5 class="mb-1">${todo.titulo}</h5>
                ${todo.detalhe == null ? '' : `<p class="mb-1">${todo.detalhe}</p>`}
                ${todo.data_entrega == null ? '' : `<small class="p-1 pe-2 ps-2 border rounded">${formatDate(dateEntregaFormat)}</small>`}
            </div>
            <div>       
                <div class="dropdown">
                    <small role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots-vertical"></i></small>
                    <ul class="dropdown-menu">
                    <li><a class="dropdown-item" onclick='showModalUpdate(${JSON.stringify(todo)})'><i class="bi bi-pen pe-2"></i>Editar</a></li>
                    <li><a class="dropdown-item" onclick="deleteTodo(${todo.id})"><i class="bi bi-trash pe-2"></i>Excluir</a></li>
                    </ul>
                </div>
            </div>
        `;

        tbody.appendChild(div)
    });

}

async function newTodo(event) {
    event.preventDefault();
    const form = document.querySelector('#form-new-todo');
    const data_entrega = form.querySelector('[name="data-entrega"]').value;
    const titulo = form.querySelector('[name="titulo"]').value;
    const detalhe = form.querySelector('[name="detalhe"]').value;

    try {
        const response = await fetch('/todo/', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                titulo: titulo,
                detalhe: detalhe,
                data_entrega: data_entrega
            })
        });
        listTodos();


        modalmodalNewTodoBootstrap.hide()
    } catch (error) {
        console.log(error);
    }

}

async function deleteTodo(pk) {
    try {
        const response = await fetch('/todo/', {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify({
                pk
            })

        });

        listTodos();

    }
    catch (erro) {

    }

}

async function checkTodo(key) {
    try {
        const response = await fetch('/todo/', {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({
                key
            })
        });
        listTodos();

    } catch (error) {
        console.log(error);
    }

}

function showModalUpdate(todo) {
    const formUpdate = modalUpdateTodo.querySelector('form');
    formUpdate.querySelector('[name="data-entrega"]').value = todo.data_entrega;
    formUpdate.querySelector('[name="titulo"]').value = todo.titulo;
    formUpdate.querySelector('[name="detalhe"]').value = todo.detalhe;

    formUpdate.onsubmit = function (event) {
        updateTodo(event, todo.id)
    };
    modalUpdateTodoBootstrap.show();

}

async function updateTodo(event, id) {
    event.preventDefault();
    const form = document.querySelector('#modal-update-todo');
    const data_entrega = form.querySelector('[name="data-entrega"]').value;
    const titulo = form.querySelector('[name="titulo"]').value;
    const detalhe = form.querySelector('[name="detalhe"]').value;

    try {
        const response = await fetch('/todo/', {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({
                data_entrega: data_entrega,
                titulo: titulo,
                detalhe: detalhe,
                pk: id
            })

        })
        listTodos();
        modalUpdateTodoBootstrap.hide();

    }
    catch (erro) {
        console.log(erro);
    }
}

function updateHome() {
    listTodos();
    modalNewTodo.addEventListener('hidden.bs.modal', function () {
        modalNewTodo.querySelector('#data-entrega').value = null;
        modalNewTodo.querySelector('#titulo').value = null;
        modalNewTodo.querySelector('#detalhe').value = null;

    })
}

function updateComplated() {
    listTodos();
}
