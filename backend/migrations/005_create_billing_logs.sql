CREATE TYPE billing_status AS ENUM ('SUCCESS', 'FAILED');

CREATE TABLE billing_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID            NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id         UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID            NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  plan_id         UUID            NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  amount          DECIMAL(10,2)   NOT NULL CHECK (amount > 0),
  status          billing_status  NOT NULL,
  billing_period  VARCHAR(7)      NOT NULL,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_subscription_period UNIQUE (subscription_id, billing_period)
);

CREATE INDEX idx_billing_logs_tenant_id       ON billing_logs (tenant_id);
CREATE INDEX idx_billing_logs_subscription_id ON billing_logs (subscription_id);
