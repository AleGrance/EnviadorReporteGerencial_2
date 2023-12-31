"use strict";

module.exports = function (sequelize, DataType) {
  var Historicos = sequelize.define("Historicos", {
    historico_id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha: {
      type: DataType.DATEONLY,
      allowNull: false,
      unique: true
    },
    cant_enviados: {
      type: DataType.BIGINT,
      allowNull: false
    },
    cant_no_enviados: {
      type: DataType.BIGINT,
      allowNull: false
    }
  });

  Historicos.associate = function (models) {
    Historicos.belongsTo(models.Users, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
        defaultValue: 1
      }
    });
  };

  return Historicos;
};