export default (sequelize, DataTypes) => {
  const PembelianDetail = sequelize.define(
    "PembelianDetail",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      qty: { type: DataTypes.INTEGER, allowNull: false },
      harga_satuan: { type: DataTypes.DECIMAL(10), allowNull: false },
    },
    {
      freezeTableName: true,
    }
  );

  return PembelianDetail;
};
