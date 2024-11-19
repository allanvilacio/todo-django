const csrftoken = document.querySelector('[name="csrfmiddlewaretoken"]').value;
const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrftoken
};


const newTodo = document.getElementById('modal-nova-tarefa');
let modalnewTodo = null
if (newTodo) {
    modalnewTodo = new bootstrap.Modal(newTodo, { keyboard: true });
}

const updateModal = document.getElementById('modal-update-todo');
let modalUpdate = null
if (updateModal) {
    modalUpdate = new bootstrap.Modal(updateModal, { keyboard: true });
}


function formatDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

async function getTodos() {
    path = window.location.pathname

    const response = await fetch('/listar-todos/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            path: path
        })
    });

    const data = await response.json();
    return data
}

async function listarTodos() {
    const response = await getTodos();

    const tbody = document.querySelector('#lista-todo');
    tbody.textContent = '';

    response['data'].forEach(todo => {

        let div = document.createElement('div');
        div.classList.add("d-flex", "list-group-item", "list-group-item-action", "justify-content-between", "rounded", "border-0", "border-bottom");

        div.ondblclick = function () { showModalUpdate(todo) }


        div.innerHTML = `
            <div>
                <div class="form-check">
                <input class="form-check-input" type="checkbox" ${todo.data_conclusao ? "checked" : ""} onclick="checkTodo(${todo.id})">
            </div>
            </div>
                <div class="w-100">
                <h5 class="mb-1">${todo.titulo}</h5>
                ${todo.detalhe == null ? '' : `<p class="mb-1">${todo.detalhe}</p>`}
                ${todo.data_entrega == null ? '' : `<small class="p-1 pe-2 ps-2 border rounded">${todo.data_entrega}</small>`}
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

async function novaTarefa(event) {
    event.preventDefault();
    const form = document.querySelector('#form-nova-tarefa');
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
        listarTodos();


        modalnewTodo.hide()
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

        listarTodos();

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
        listarTodos();

    } catch (error) {
        console.log(error);
    }

}

function showModalUpdate(todo) {
    const formUpdate = updateModal.querySelector('form');
    formUpdate.querySelector('[name="data-entrega"]').value = todo.data_entrega;
    formUpdate.querySelector('[name="titulo"]').value = todo.titulo;
    formUpdate.querySelector('[name="detalhe"]').value = todo.detalhe;

    formUpdate.onsubmit = function (event) {
        updateTodo(event, todo.id)
    };
    modalUpdate.show();

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
        listarTodos();
        modalUpdate.hide();

    }
    catch (erro) {
        console.log(erro);
    }
}

function updateHome() {
    listarTodos();
    let modalNovaTarefa = document.getElementById('modal-nova-tarefa');

    modalNovaTarefa.addEventListener('hidden.bs.modal', function () {

        document.getElementById('data-entrega').value = null;
        document.getElementById('titulo').value = null;
        document.getElementById('detalhe').value = null;

    })
}

function updateConcluidos() {
    listarTodos();
}
