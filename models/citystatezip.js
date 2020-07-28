"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CityStateZip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CityStateZip.hasMany(models.Address, {
        foreignKey: "cityStateZipId",
      });
    }
  }
  CityStateZip.init(
    {
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      zip_code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CityStateZip",
    }
  );
  return CityStateZip;
};
