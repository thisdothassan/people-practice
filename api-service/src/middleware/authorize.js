const { ForbiddenError, NotFoundError } = require("../utils");
const {
  CustomerPolicy,
  OrderPolicy,
  ManagerPolicy,
  LocationPolicy,
  ProductPolicy,
} = require("../policies");
const {
  CustomerRepository,
  OrderRepository,
  ManagerRepository,
  LocationRepository,
  ProductRepository,
} = require("../repositories");

const ROUTE_PERMISSIONS = {
  "customers:list": [CustomerPolicy, "canViewList"],
  "customers:create": [CustomerPolicy, "canCreate"],
  "orders:list": [OrderPolicy, "canViewList"],
  "orders:create": [OrderPolicy, "canCreate"],
  "managers:list": [ManagerPolicy, "canViewList"],
  "managers:create": [ManagerPolicy, "canCreate"],
  "locations:list": [LocationPolicy, "canViewList"],
  "locations:create": [LocationPolicy, "canCreate"],
  "products:create": [ProductPolicy, "canCreate"],
};

/**
 * Route-level authorization. Use for list and create routes.
 * Call after authenticate. Blocks with 403 if user cannot access the route.
 */
function authorize(permission) {
  return (req, res, next) => {
    const config = ROUTE_PERMISSIONS[permission];
    if (!config) return next(new Error(`Unknown permission: ${permission}`));
    const [PolicyClass, method] = config;
    const policy = new PolicyClass(req.user);
    const allowed = policy[method]();
    if (!allowed)
      return next(
        new ForbiddenError(
          "You do not have permission to access this resource",
        ),
      );
    next();
  };
}

const RESOURCE_CONFIG = {
  customer: {
    repository: CustomerRepository,
    findMethod: "findById",
    idParam: "id",
    attachKey: "customer",
    view: [CustomerPolicy, "canView"],
    update: [CustomerPolicy, "canUpdate"],
    delete: [CustomerPolicy, "canDelete"],
  },
  order: {
    repository: OrderRepository,
    findMethod: "findById",
    idParam: "id",
    attachKey: "order",
    view: [OrderPolicy, "canViewAsync"],
    update: [OrderPolicy, "canUpdate"],
  },
  manager: {
    repository: ManagerRepository,
    findMethod: "findById",
    idParam: "id",
    attachKey: "manager",
    view: [ManagerPolicy, "canView"],
  },
  location: {
    repository: LocationRepository,
    findMethod: "findById",
    idParam: "id",
    attachKey: "location",
    view: [LocationPolicy, "canView"],
    update: [LocationPolicy, "canUpdate"],
  },
  product: {
    repository: ProductRepository,
    findMethod: "findById",
    idParam: "id",
    attachKey: "product",
    update: [ProductPolicy, "canUpdate"],
  },
};

/**
 * Resource-level authorization. Loads resource by id, checks policy, attaches to req.
 * Use for GET/PATCH/DELETE :id routes. Call after authenticate.
 */
function authorizeResource(resourceType, action) {
  const config = RESOURCE_CONFIG[resourceType];
  if (!config || !config[action])
    return (req, res, next) =>
      next(new Error(`Unknown resource or action: ${resourceType}:${action}`));

  const { repository, findMethod, idParam, attachKey } = config;
  const [PolicyClass, method] = config[action];

  return async (req, res, next) => {
    try {
      const id = parseInt(req.params[idParam], 10);
      if (Number.isNaN(id))
        return next(new NotFoundError("Resource not found"));
      const resource = await repository[findMethod](id);
      if (!resource) return next(new NotFoundError("Resource not found"));

      const policy = new PolicyClass(req.user);
      let allowed;
      if (method === "canViewAsync") {
        allowed = await policy.canViewAsync(resource);
      } else {
        allowed = policy[method](resource);
      }
      if (!allowed)
        return next(
          new ForbiddenError(
            "You do not have permission to access this resource",
          ),
        );
      req[attachKey] = resource;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { authorize, authorizeResource };
