'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('contacts', "status", { 
      type: Sequelize.ENUM("ACTIVE", "ARCHIVED"), 
      allowNull: false,
      defaultValue: "ACTIVE",
  });
},

 down: queryInterface => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn("contacts", "status", {transaction});
      await queryInterface.sequelize.query("DROP TYPE enum_contact_status", { // apagando tipos personalizados no postgresql
        transaction
      });
    });
  }
};
