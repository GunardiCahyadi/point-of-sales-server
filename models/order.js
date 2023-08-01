"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.OrderDetail);
      Order.belongsTo(models.Table, { foreignKey: "TableId" });
    }
  }
  Order.init(
    {
      orderNo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "orderNo is required",
          },
          notEmpty: {
            msg: "orderNo is required",
          },
        },
      },
      grandTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          notNull: {
            msg: "grandTotal is required",
          },
          notEmpty: {
            msg: "grandTotal is required",
          },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Uncompleted",
        validate: {
          notNull: {
            msg: "status is required",
          },
          notEmpty: {
            msg: "status is required",
          },
        },
      },
      TableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "TableId is required",
          },
          notEmpty: {
            msg: "TableId is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
