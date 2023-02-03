const { Router } = require("express");
const MovieTagsController = require("../controllers/MovieTagsController");

const tagsRoutes = Router();

const tagsController = new MovieTagsController();

tagsRoutes.get("/:user_id", tagsController.index);

module.exports = tagsRoutes;
