import { DataTypes } from "sequelize";

export default function (sequelize) {
  const BillingLog = sequelize.define("BillingLog", {
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: { model: "users", key: "id" },
    },
    subscriptionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "subscription_id",
      references: { model: "subscriptions", key: "id" },
    },
    planId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "plan_id",
      references: { model: "plans", key: "id" },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { isIn: [["SUCCESS", "FAILED"]] },
    },
    billingPeriod: {
      type: DataTypes.STRING(7),
      allowNull: false,
      field: "billing_period",
    },
  }, {
    tableName: "billing_logs",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ["subscription_id", "billing_period"],
      },
    ],
  });

  return BillingLog;
}
