const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      throw new AppError("Nome, email e senha são obrigatórios!");
    }

    const checkUserExists = await knex("users").where({ email: email }).first();

    if (checkUserExists) {
      throw new AppError("Este email já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({ name, email, password: hashedPassword });

    return response.json();
  }

  async update(request, response) {
    const { name, email, old_password, password } = request.body;
    const { id } = request.params;

    const user = await knex("users").where({ id: id }).first();

    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    //se existir conteudo dentro de name, usar. Se não, manter o que ja estava.
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      console.log(old_password, user.password);
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha!"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError(
          "A senha antiga não confere com a previamente cadastrada!"
        );
      }

      user.password = await hash(password, 8);
    }

    await knex("users")
      .update({
        name: user.name,
        email: user.email,
        password: user.password,
        updated_at: knex.fn.now(),
      })
      .where({ id });

    return response.json();
  }

  async delete(request, response) {
    const { user_id } = request.params;

    const user_delete = await knex("users").where("id", user_id).del();

    return response.json();
  }
}

module.exports = UsersController;
