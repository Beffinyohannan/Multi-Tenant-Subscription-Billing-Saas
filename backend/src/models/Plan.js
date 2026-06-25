import { DataTypes } from "sequelize";

export default function (sequelize) {
  const Plan = sequelize.define("Plan", {
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    billingInterval: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "billing_interval",
      validate: { isIn: [["weekly", "monthly", "yearly"]] },
    },
  }, {
    tableName: "plans",
    underscored: true,
    timestamps: true,
  });

  return Plan;
}
