import * as Yup from "yup";
import { Op } from "sequelize";
// import { parseISO } from "date-fns";

import Customer from "../models/Customer";
import Contact from "../models/Contact";

class ContactsController {
  async index(req, res) {

    const data = await Contact.findAll({
      where,
      include: [
        { 
          model: Customer,
          attributes: ["id", "status"],
          required: true,
        },
      ],
      order,
      limit,
      offset: limit * page - limit,
    });

    return res.json(data);
  }

  async show(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
      attributes: { exclude: ["customer_id", "customerId"] },
    });

    if (!contact) {
      return res.status(404).json();
    }

    return res.json(contact);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      status: Yup.string().uppercase(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: "Error on validate schema.",
      });
    }

    const contact = await Contact.create({
      customer_id: req.params.customerId,
      ...req.body,
    });

    return res.status(201).json(contact);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      status: Yup.string().uppercase(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: "Error on validate schema.",
      });
    }

    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
      attributes: { exclude: ["customer_id", "customerId"] },
    });

    if (!contact) {
      return res.status(404).json();
    }

    await contact.update(req.body);

    return res.json(contact);
  }

  async destroy(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
    });

    if (!contact) {
      return res.status(404).json();
    }

    await contact.destroy();

    return res.json();
  }
}

export default new ContactsController();
