const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username === username);

  if (user) {
    request.user = user;
    return next();
  }

  return response.status(404).json({error: 'Usuário não existe no sistema.'});
}

function getTodoById(todos, todoId) {
  const todo = todos.find(todo => todo.id === todoId);
  if (todo) {
    return todo;
  }
  return null;
}

//criar um usuário
app.post('/users', (request, response) => {
  const {name, username} = request.body;
  const id = uuidv4();

  const usernameAlreadyExists = users.some(user => user.username === username);

  if (usernameAlreadyExists) {
    return response.status(400).json({error: "Este nome de usuário já existe."});
  }

  const user = {
    id,
    name,
    username,
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);
});

//verificar todos através de um username
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const todos = user.todos;

  return response.json(todos);
});

//criar um todo através do username
app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body;
  const { user } = request;
  const id = uuidv4();

  const todo = {
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(todo);

  return response.status(201).json(todo);

});

//editar um todo através do username
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title,deadline } = request.body;
  const { id } = request.params;
  const { user } = request;

  const todo = getTodoById(user.todos, id);

  if (!todo) {
    return response.status(404).json({error: "todo não identificado."});
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);
});

//alterar um todo para "done" através do username
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = getTodoById(user.todos, id);

  if (!todo) {
    return response.status(404).json({error: "todo não identificado."});
  }

  todo.done = true;
  return response.status(201).json(todo);
});

//deletar um todo através do username
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = getTodoById(user.todos, id);

  if (!todo) {
    return response.status(404).json({error: "todo não identificado."});
  }

  const indexOfTodo = user.todos.indexOf(todo);
  user.todos.splice(indexOfTodo, 1);

  return response.status(204).json(user.todos);
});

module.exports = app;