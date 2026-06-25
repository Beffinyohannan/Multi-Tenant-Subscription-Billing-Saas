export function validate(schema, source = "body", options = {}) {
  return (req, _res, next) => {
    const data = schema.parse(req[source]);
    if (options.mergeUser && req.user?.tenantId) {
      data.tenantId = req.user.tenantId;
    }
    req[source] = data;
    next();
  };
}
