//express controla rotas dentro da aplicação
const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4'); 

const app = express();

app.use(cors());
//configurar express para interpretar JSON
app.use(express.json());

//jamais utilizar em produção
const projects = [];
 
//middleware
function logRequests(request, response, next) {
  const { method, url } = request;
  const logLable =  `[${method.toUpperCase()}] ${url}`;

  console.time(logLable);

  next(); //próximo middleware

  console.timeEnd(logLable);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error: "Invalid Project ID."});
  }

  return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
  //const query = request.query;
  const {title} = request.query;

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return response.json(results);
});
 
app.post('/projects', (request, response) => {
  const {title, owner} = request.body;

  const project = {id: uuid(), title, owner}
  
  projects.push(project);
  
  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const {title, owner} = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if(projectIndex < 0) {
    return response.status(400).json({error: "Project not found"});
  }

  const project =  {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;
  
  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if(projectIndex < 0) {
    return response.status(400).json({error: "Project not found"});
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

//define a porta em que a aplicação vai rodar
app.listen(3333, () => {
  console.log('🚀 Back-end Started!')
});



