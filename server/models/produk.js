export default (sequelize, DataTypes) => {
  const Produk = sequelize.define(
    "Produk",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nama: { type: DataTypes.STRING, allowNull: false },
      harga_beli: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      harga_jual: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      stok: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      freezeTableName: true,
    }
  );

  return Produk;
};
