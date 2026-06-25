import { DataTypes } from "sequelize";

export default function (sequelize) {
  const AuditLog = sequelize.define("AuditLog", {
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
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["PLAN_CREATED", "PLAN_DELETED", "USER_CREATED", "USER_DELETED", "SUBSCRIPTION_ASSIGNED", "BILLING_RUN"]],
      },
    },
    entityType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "entity_type",
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "entity_id",
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    tableName: "audit_logs",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });

  return AuditLog;
}
