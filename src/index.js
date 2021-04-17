const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkExistanceOfRepository(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repositories[repositoryIndex];

  next();
}

// app.use(/^\/repositories\/:id/, checkExistanceOfRepository);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put(
  "/repositories/:id",
  checkExistanceOfRepository,
  (request, response) => {
    const { title, techs, url } = request.body;
    const { repository } = request;

    if (title) repository.title = title;
    if (title) repository.techs = techs;
    if (title) repository.url = url;

    return response.json(repository);
  }
);

app.delete(
  "/repositories/:id",
  checkExistanceOfRepository,
  (request, response) => {
    const { repository } = request;

    const selectedIndex = repositories.findIndex( repo => repo === repository)

    repositories.splice(selectedIndex, 1);

    return response.status(204).send();
  }
);

app.post(
  "/repositories/:id/like",
  checkExistanceOfRepository,
  (request, response) => {
    const { repository } = request;

    const likes = ++repository.likes;

    return response.json({ likes });
  }
);

module.exports = app;
