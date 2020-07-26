"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Addresses",
      [
        {
          formatted: "525 W Santa Clara St",
          cityStateZipId: 1,
          lat: 37.3328955,
          lon: -121.9010841,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          formatted: "1811 Hillsdale Ave",
          cityStateZipId: 2,
          lat: 37.2648887,
          lon: -121.93944,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          formatted: "1855 Hillsdale Ave",
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
