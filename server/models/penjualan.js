export default (sequelize, DataTypes) => {
  const Penjualan = sequelize.define(
    "Penjualan",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      total_harga: { type: DataTypes.DECIMAL(10), allowNull: false },
    },
    {
      freezeTableName: true,
    }
  );

  return Penjualan;
};
