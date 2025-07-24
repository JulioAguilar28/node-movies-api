import camelcaseKeys from "camelcase-keys";

export function camelCaseBody(req, _res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = camelcaseKeys(req.body, { deep: true });
  }

  next();
}
