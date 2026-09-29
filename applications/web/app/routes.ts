import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/MainLayout.tsx", [
    index("routes/Home.tsx"),
    route("s/:code", "routes/s.$code.tsx"),
  ]),
] satisfies RouteConfig;
