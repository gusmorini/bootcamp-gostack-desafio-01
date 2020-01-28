const express = require('express')

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  ConsoleCount()
  next()
})

let projects = []

const ConsoleCount = () => {
  return console.count('number request')
}

const CheckId = (req, res, next) => {
  const index = projects.findIndex(i => i.id == req.params.id)
  if (index < 0) {
    return res.status(400).json({ error: 'User does not exists' })
  }
  req.id = req.params.id
  req.index = index
  return next()
}

app.get('/projects', (req, res) => {
  return res.json(projects)
})

app.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body
  projects.push({ "id": id, "title": title, "tasks": tasks })
  return res.json(projects)
})

app.put('/projects/:id', CheckId, (req, res) => {
  const { title } = req.body
  projects[req.index].title = title
  return res.json(projects[req.index])
})

app.delete('/projects/:id', CheckId, (req, res) => {
  //projects = projects.filter(project => project.id != req.id)
  projects.splice(req.index, 1)
  return res.send()
})

app.post('/projects/:id/tasks', CheckId, (req, res) => {
  const { title } = req.body
  const index = projects.findIndex(i => i.id == req.id)
  projects[index].tasks.push({ title })
  return res.json(projects[index])
})

app.listen(3333)