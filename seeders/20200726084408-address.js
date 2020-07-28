"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Addresses",
      [
        {
          street: "525 w santa clara st",
          cityStateZipId: 1,
          lat: 37.3328955,
          lon: -121.9010841,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          street: "1811 hillsdale ave",
          cityStateZipId: 2,
          lat: 37.2648887,
          lon: -121.93944,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          street: "1855 hillsdale ave",
          cityStateZipId: 2,
          lat: 37.2648936,
          lon: -121.9131755,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Address", null, {});
  },
};
