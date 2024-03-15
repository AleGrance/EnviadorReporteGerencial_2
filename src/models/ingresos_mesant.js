module.exports = (sequelize, DataType) => {
  const Ingresos_mesant = sequelize.define(
    "Ingresos_mesant",
    {
      id_ingresos_mesant: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      FECHA: {
        type: DataType.DATEONLY,
        allowNull: false,
      },

      TIPO: {
        type: DataType.STRING,
        allowNull: false,
      },

      CUOTA_SOCIAL: {
        type: DataType.STRING,
        allowNull: false,
      },

      TRATAMIENTO: {
        type: DataType.STRING,
        allowNull: false,
      },

      COBRADOR: {
        type: DataType.STRING,
        allowNull: false,
      },

      VENTA_NUEVA: {
        type: DataType.STRING,
        allowNull: false,
      },

      ONIX: {
        type: DataType.STRING,
        allowNull: false,
      },

      MONTO_TOTAL: {
        type: DataType.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true, // Evita la pluralización del nombre de la tabla
    }
  );

  Ingresos_mesant.associate = (models) => {
    Ingresos_mesant.belongsTo(models.Users, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
        defaultValue: 1,
      },
    });
  };
  return Ingresos_mesant;
};
