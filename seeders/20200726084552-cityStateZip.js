"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "CityStateZips",
      [
        {
          city: "san jose",
          state: "CA",
          zip_code: "95113",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          city: "san jose",
          state: "CA",
          zip_code: "95124",
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
