export default (sequelize, DataTypes) => {
  const Pelanggan = sequelize.define(
    "Pelanggan",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nama: { type: DataTypes.STRING, allowNull: false },
      no_hp: { type: DataTypes.STRING },
      alamat: { type: DataTypes.STRING },
      poin: { type: DataTypes.INTEGER, defaultValue: 0 }, // Tambah field poin
    },
    {
      freezeTableName: true,
    }
  );

  return Pelanggan;
};
