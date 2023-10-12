"use strict";

module.exports = function (sequelize, DataType) {
  var Ingresos_mesact = sequelize.define("Ingresos_mesact", {
    id_ingresos_mesact: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    FECHA: {
      type: DataType.DATEONLY,
      allowNull: false
    },
    TIPO: {
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

  Ingresos_mesact.associate = function (models) {
    Ingresos_mesact.belongsTo(models.Users, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
        defaultValue: 1
      }
    });
  };

  return Ingresos_mesact;
};