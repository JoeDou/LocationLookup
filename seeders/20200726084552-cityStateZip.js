"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "CityStateZips",
      [
        {
          city: "San Jose",
          state: "CA",
          zip: "95113",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          city: "San Jose",
          state: "CA",
          zip: "95124",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("CityStateZip", null, {});
  },
};
