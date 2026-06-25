import { DataTypes } from "sequelize";

export default function (sequelize) {
  const Tenant = sequelize.define("Tenant", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  }, {
    tableName: "tenants",
    underscored: true,
    timestamps: true,
  });

  return Tenant;
}
