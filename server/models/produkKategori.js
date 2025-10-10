export default (sequelize, DataTypes) => {
  const ProdukKategori = sequelize.define(
    "ProdukKategori",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nama: { type: DataTypes.STRING, allowNull: false },
    },
    {
      freezeTableName: true,
    }
  );

  return ProdukKategori;
};
