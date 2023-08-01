"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderDetail.belongsTo(models.Product, { foreignKey: "ProductId" });
      OrderDetail.belongsTo(models.Order, { foreignKey: "OrderId" });
    }
  }
  OrderDetail.init(
    {
      OrderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "OrderId is required",
          },
          notEmpty: {
            msg: "OrderId is required",
          },
        },
      },
      ProductId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "ProductId is required",
          },
          notEmpty: {
            msg: "ProductId is required",
          },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "quantity is required",
          },
          notEmpty: {
            msg: "quantity is required",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "price is required",
          },
          notEmpty: {
            msg: "price is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "OrderDetail",
    }
  );
  return OrderDetail;
};
