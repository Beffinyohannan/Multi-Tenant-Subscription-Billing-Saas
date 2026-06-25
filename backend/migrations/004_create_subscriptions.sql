CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

CREATE TABLE subscriptions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id  UUID                NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id    UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id    UUID                NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  status     subscription_status NOT NULL DEFAULT 'ACTIVE',
  start_date TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  end_date   TIMESTAMPTZ,
  created_at TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_subscriptions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_subscriptions_user   FOREIGN KEY (user_id)   REFERENCES users(id),
  CONSTRAINT fk_subscriptions_plan   FOREIGN KEY (plan_id)   REFERENCES plans(id)
);

CREATE INDEX idx_subscriptions_tenant_id ON subscriptions (tenant_id);
CREATE INDEX idx_subscriptions_user_id   ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_plan_id   ON subscriptions (plan_id);

CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
