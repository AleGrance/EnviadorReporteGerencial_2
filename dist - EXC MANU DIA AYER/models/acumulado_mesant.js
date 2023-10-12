"use strict";

module.exports = function (sequelize, DataType) {
  var Acumulado_mesant = sequelize.define("Acumulado_mesant", {
    id_acumulado_mesant: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    FECHA: {
      type: DataType.DATEONLY,
      allowNull: false
    },
    SUCURSAL: {
      type: DataType.STRING,
      allowNull: false
    },
    CUOTA_SOCIAL: {
      type: DataType.STRING,
      allowNull: false
    },
    TRATAMIENTO: {
      type: DataType.STRING,
      allowNull: false
    },
    COBRADOR: {
      type: DataType.STRING,
      allowNull: false
    },
    VENTA_NUEVA: {
      type: DataType.STRING,
      allowNull: false
    },
    MONTO_TOTAL: {
      type: DataType.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true // Evita la pluralización del nombre de la tabla

  });

  Acumulado_mesant.associate = function (models) {
    Acumulado_mesant.belongsTo(models.Users, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
        defaultValue: 1
      }
    });
  };

  return Acumulado_mesant;
};