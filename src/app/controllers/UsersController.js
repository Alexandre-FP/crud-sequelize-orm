import * as Yup from "yup";
import { Op } from "sequelize";
// import { parseISO } from "date-fns";
import Mail from "../../lib/Mail"

import User from "../models/User";

class UsersController {
  async index(req, res) {

    const data = await User.findAll({
      attributes: {
        exclude: ["password_hash"]
      }
    });

    return res.json(data);
  }

  async show(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json();
    }

    const { id, name, email, createdAt, updatedAt } = user;

    return res.json({ id, name, email, createdAt, updatedAt });
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(8),
      passwordConfirmation: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ 
        error: "Error on validate schema.",
      });
    }

    const { id, name, email, createdAt, updatedAt } = await User.create(
      req.body 
    );

    Mail.send({
 
        to: email,
        subject: "Bem-vindo(a)",
        text: `Olá ${name}, bem-vindo(a) ao nosso sistema`
  
    })

    return res.status(201).json({ id, name, email, createdAt, updatedAt });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      passwordConfirmation: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: "Error on validate schema.",
      });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json();
    }

    const { oldPassword } = req.body;

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "User password not match." });
    }

    const { id, name, email, createdAt, updatedAt } = await user.update(
      req.body
    );

    return res.status(201).json({ id, name, email, createdAt, updatedAt });
  }

  async destroy(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json();
    }

    await user.destroy();

    return res.json();
  }
}

export default new UsersController();
