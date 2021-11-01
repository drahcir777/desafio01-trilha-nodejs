const express = require('express');
const cors = require('cors');

const { v4: uuidv4, v4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers
  const user = users.find(e => e.username === username)
  if (user) {
    request.user = user
    return next()
  } else {
    return response.status(404).json({ error: 'Usuário não existe' })
  }
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  let usuario = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  const usuarioExiste = users.some(u => u.username === username)
  if (usuarioExiste) {
    response.status(400).json({ error: "Usuário já existe" })
  }

  users.push(usuario)

  return response.status(201).json(usuario)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body
  const { user } = request

  const todo = {
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  response.status(201).json(todo)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body
  const { user } = request
  const { id } = request.params

  const todo = user.todos.find(todo => todo.id === id)

  if (!todo) {
    return response.status(404).json({ error: "Todo não existe" })
  }

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.json(todo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params

  const todo = user.todos.find(todo => todo.id === id)

  if (!todo) {
    return response.status(404).json({ error: "Todo não existe" })
  }

  todo.done = true

  return response.json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params

  const todo = user.todos.findIndex(todo => todo.id === id)
  if (todo > -1) {
    user.todos.splice(todo, 1)
    return response.status(204).json()
  } else {
    return response.status(404).json({ error: "Todo não existe" })
  }
});

module.exports = app;