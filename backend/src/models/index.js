import sequelize from "../config/database.js";
import defineTenant from "./Tenant.js";
import defineUser from "./User.js";
import definePlan from "./Plan.js";
import defineSubscription from "./Subscription.js";
import defineBillingLog from "./BillingLog.js";
import defineAuditLog from "./AuditLog.js";

const Tenant = defineTenant(sequelize);
const User = defineUser(sequelize);
const Plan = definePlan(sequelize);
const Subscription = defineSubscription(sequelize);
const BillingLog = defineBillingLog(sequelize);
const AuditLog = defineAuditLog(sequelize);

Tenant.hasMany(User, { foreignKey: "tenant_id", as: "users" });
User.belongsTo(Tenant, { foreignKey: "tenant_id", as: "tenant" });

Tenant.hasMany(Plan, { foreignKey: "tenant_id", as: "plans" });
Plan.belongsTo(Tenant, { foreignKey: "tenant_id", as: "tenant" });

Tenant.hasMany(Subscription, { foreignKey: "tenant_id", as: "subscriptions" });
Subscription.belongsTo(Tenant, { foreignKey: "tenant_id", as: "tenant" });

User.hasMany(Subscription, { foreignKey: "user_id", as: "subscriptions" });
Subscription.belongsTo(User, { foreignKey: "user_id", as: "user" });

Plan.hasMany(Subscription, { foreignKey: "plan_id", as: "subscriptions" });
Subscription.belongsTo(Plan, { foreignKey: "plan_id", as: "plan" });

Tenant.hasMany(BillingLog, { foreignKey: "tenant_id", as: "billingLogs" });
BillingLog.belongsTo(Tenant, { foreignKey: "tenant_id", as: "tenant" });

User.hasMany(BillingLog, { foreignKey: "user_id", as: "billingLogs" });
BillingLog.belongsTo(User, { foreignKey: "user_id", as: "user" });

Subscription.hasMany(BillingLog, { foreignKey: "subscription_id", as: "billingLogs" });
BillingLog.belongsTo(Subscription, { foreignKey: "subscription_id", as: "subscription" });

Plan.hasMany(BillingLog, { foreignKey: "plan_id", as: "billingLogs" });
BillingLog.belongsTo(Plan, { foreignKey: "plan_id", as: "plan" });

Tenant.hasMany(AuditLog, { foreignKey: "tenant_id", as: "auditLogs" });
AuditLog.belongsTo(Tenant, { foreignKey: "tenant_id", as: "tenant" });

User.hasMany(AuditLog, { foreignKey: "user_id", as: "auditLogs" });
AuditLog.belongsTo(User, { foreignKey: "user_id", as: "user" });

export { sequelize as default, sequelize, Tenant, User, Plan, Subscription, BillingLog, AuditLog };
