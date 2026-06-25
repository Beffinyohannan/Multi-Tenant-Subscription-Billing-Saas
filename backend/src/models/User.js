import { DataTypes } from "sequelize";

export default function (sequelize) {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "tenant_id",
      references: { model: "tenants", key: "id" },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "USER",
      validate: { isIn: [["ADMIN", "USER"]] },
    },
  }, {
    tableName: "users",
    underscored: true,
    timestamps: true,
  });

  return User;
}
