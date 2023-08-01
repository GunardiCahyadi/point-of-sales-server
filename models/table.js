"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Table.hasOne(models.Order);
    }
  }
  Table.init(
    {
      tableNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "tableNo is required",
          },
          notEmpty: {
            msg: "tableNo is required",
          },
        },
      },
      pax: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "pax is required",
          },
          notEmpty: {
            msg: "pax is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Table",
    }
  );
  return Table;
};
