CREATE TYPE audit_action AS ENUM (
  'PLAN_CREATED',
  'PLAN_DELETED',
  'USER_CREATED',
  'USER_DELETED',
  'SUBSCRIPTION_ASSIGNED',
  'BILLING_RUN'
);

CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID         NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action      audit_action NOT NULL,
  entity_type VARCHAR(50)  NOT NULL,
  entity_id   UUID,
  metadata    JSONB,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant_id ON audit_logs (tenant_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at DESC);
