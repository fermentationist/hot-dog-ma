import Home from "../pages/Home";
import BrewhousesPage from "../pages/Brewhouses";
import Fermentables from "../pages/Fermentables";
import InventoryPage from "../pages/Inventory";
import InventoryDetailsPage from "../pages/InventoryDetails";
import Users from "../pages/Users";
import Variants from "../pages/Variants";
import withBreweryRequired from "../hoc/withBreweryRequired";
import Orders from "../pages/Orders";
import ShipmentsPage from "../pages/Shipments";

const Inventory = withBreweryRequired(InventoryPage);
const InventoryDetails = withBreweryRequired(InventoryDetailsPage);
const Shipments = withBreweryRequired(ShipmentsPage);
const Brewhouses = withBreweryRequired(BrewhousesPage);

export interface Routes {
  [route: string]: {
    roles: string[];
    component: JSX.Element;
  }
}

const routes: Routes = {
  "/": {
    roles: ["user", "manager", "admin"],
    component: <Home />
  },
  "/home": {
    roles: ["user", "manager", "admin"],
    component: <Home />
  },
  "/brewhouses": {
    roles: ["user", "manager", "admin"],
    component: <Brewhouses />
  },
  "/ingredients/fermentables": {
    roles: ["user", "manager", "admin"],
    component: <Fermentables />
  },
  "/inventory/details": {
    roles: ["user", "manager", "admin"],
    component: <InventoryDetails />
  },
  "/users": {
    roles: ["admin", "manager"],
    component: <Users />
  },
  "/variants": {
    roles: ["admin"],
    component: <Variants />
  },
  "/orders": {
    roles: ["admin"],
    component: <Orders />
  },
  "/shipments": {
    roles: ["admin", "manager", "user"],
    component: <Shipments />
  }
}

export default routes;
