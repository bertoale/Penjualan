export default (sequelize, DataTypes) => {
  const Supplier = sequelize.define(
    "Supplier",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nama: { type: DataTypes.STRING, allowNull: false },
      no_hp: { type: DataTypes.STRING },
      alamat: { type: DataTypes.STRING },
    },
    {
      freezeTableName: true,
    }
  );

  return Supplier;
};
