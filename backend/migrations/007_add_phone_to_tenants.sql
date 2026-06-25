ALTER TABLE tenants ADD COLUMN phone VARCHAR(20);

CREATE INDEX idx_tenants_phone ON tenants (phone);
