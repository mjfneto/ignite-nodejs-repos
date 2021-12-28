const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use("/repositories/:id", checkRepoByID);

const repositories = [];

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

app.put("/repositories/:id", (request, response) => {
  let { repositoryIndex: index } = request;
  const { likes, ...updatedRepository } = request.body;

  const repo = { ...repositories[index], ...updatedRepository };

  repositories[index] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { repositoryIndex: index } = request;

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repositoryIndex: index } = request;
  const likes = ++repositories[index].likes;

  return response.json({
    likes,
  });
});

module.exports = app;

/* Middlewares */

function checkRepoByID(request, response, next) {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repositoryIndex = repositoryIndex;

  next();
}
