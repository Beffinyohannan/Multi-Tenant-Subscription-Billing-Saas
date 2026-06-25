CREATE TABLE plans (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID         NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name             VARCHAR(255) NOT NULL,
  price            DECIMAL(10,2) NOT NULL CHECK (price > 0),
  billing_interval VARCHAR(20)  NOT NULL CHECK (billing_interval IN ('weekly', 'monthly', 'yearly')),
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plans_tenant_id ON plans (tenant_id);

CREATE TRIGGER set_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
