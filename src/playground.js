import "./database";

import Customer from "./app/models/Customer";
import Contact from "./app/models/Contact";
import { Op } from "sequelize";

class Playground {
  /* 
    manipulando query com o sequelize = {
        operador  [Op.eq] comprador(==)
        operador  [Op.and] comprador(&&)
        operador  [Op.or] comprador(OR)
        
        [Op.and]: [{ a: 5 }, { b: 6 }],            // (a = 5) AND (b = 6)
        [Op.or]: [{ a: 5 }, { b: 6 }],             // (a = 5) OR (b = 6)
        someAttribute: {
            [Op.eq]: 3,                              // = 3
            [Op.ne]: 20,                             // != 20
            [Op.is]: null,                           // IS NULL
            [Op.not]: true,                          // IS NOT TRUE
            [Op.or]: [5, 6],                         // (someAttribute = 5) OR (someAttribute = 6)
        }
    
    */

  async criandoCustomer() {
    const customerCreate = await Customer.create({
      name: "José Silva",
      email: "jose@gmail.com",
    });
    console.log(JSON.stringify(customerCreate, null, 2)) 
  }

  async retornandoCustomers() {
    const retornandoCustomers = await Customer.scope("active").findAll({  // retornando tods os customers 
        include: [
        {
            model: Contact
        },
      ],
      order: [["createdAt", "ASC"]], // ORDERNANDO POR DATA
      limit: 2,
      offset: 2 * 2 - 2 // Paginação para retorna para o frontend
    });
    console.log(JSON.stringify(retornandoCustomers, null, 2)) 
  }

  async retornandoId() {
    const capturandoId = await Customer.findByPk(1)
    console.log(JSON.stringify(capturandoId, null, 2)) 
  }

  async deleteId() {
    const deleteId = await Customer.destroy({  // delete os customers pelo o id
      where: { 
        id: { 
            [Op.eq]: 11
        }
      }
    }); 
    console.log(JSON.stringify(deleteId, null, 2)) 
  }

  async play() {
    const customersClausula = await Customer.findAll({  // retornando tods os customers, mas fazendo Clausulas
      where: {
        id: {
          [Op.or]: [1, 2],
        },
        [Op.and]: [{ status: "ACTIVE" }], 
      },
      include: [ 
        {
            model: Contact 
        }
      ],
      attributes: ["id", "name", "email", "status"] 
    }); 
    console.log(JSON.stringify(customersClausula, null, 2))
  }
}

const playground = new Playground();
// playground.criandoCustomer()
// playground.play();
// playground.retornandoCustomers(); 
// playground.retornandoId(); 
// playground.deleteId();  
