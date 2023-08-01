"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const tabledata = require("../db/tables.json");
    const table = tabledata.map((el) => {
      delete el.id;
      el.updatedAt = new Date();
      el.createdAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert("Tables", table, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Tables", null, {});
  },
};
