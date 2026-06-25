import { DataTypes } from "sequelize";

export default function (sequelize) {
  const Subscription = sequelize.define("Subscription", {
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
    planId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "plan_id",
      references: { model: "plans", key: "id" },
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "ACTIVE",
      validate: { isIn: [["ACTIVE", "EXPIRED", "CANCELLED"]] },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "end_date",
    },
  }, {
    tableName: "subscriptions",
    underscored: true,
    timestamps: true,
  });

  return Subscription;
}
