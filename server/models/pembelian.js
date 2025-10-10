export default (sequelize, DataTypes) => {
  const Pembelian = sequelize.define(
    "Pembelian",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      tanggal: { type: DataTypes.DATEONLY, allowNull: false },
      total_harga: { type: DataTypes.DECIMAL(10), allowNull: false },
    },
    {
      freezeTableName: true,
    }
  );

  return Pembelian;
};
