"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address.belongsTo(models.CityStateZip, {
        foreignKey: "cityStateZipId",
        onDelete: "CASCADE",
      });
    }
  }
  Address.init(
    {
      street: DataTypes.STRING,
      cityStateZipId: DataTypes.INTEGER,
      lat: DataTypes.FLOAT,
      lon: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};
