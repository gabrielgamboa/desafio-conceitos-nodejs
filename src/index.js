const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  console.log(username);
  const user = users.find(user => user.username === username);

  if (user) {
    request.user = user;
    return next();
  }

  return response.status(400).json({error: 'Usuário não existe no sistena.'});
}

//criar um usuário
app.post('/users', (request, response) => {
  const {name, username} = request.body;
  const id = uuidv4();

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

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;