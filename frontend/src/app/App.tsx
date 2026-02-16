import { RouterProvider } from "react-router-dom";
import { adminRoutes } from "./admin/routes";

export const App = () => {
  return <RouterProvider router={adminRoutes} />;
};
