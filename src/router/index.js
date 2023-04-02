import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/overview",
    component: () => import("../views/OverviewView.vue"),
  },
  {
    path: "/employee",
    component: () => import("../views/EmployeeView.vue"),
  },
  {
    name: "deposit",
    path: "/deposit",
    component: () => import("../views/DepositView.vue"),
  },
  {
    name: "shopping",
    path: "/shopping",
    component: () => import("../views/ShoppingView.vue"),
  },
  {
    name: "sale",
    path: "/sale",
    component: () => import("../views/SaleView.vue"),
  },
  {
    name: "storage",
    path: "/storage",
    component: () => import("../views/StorageView.vue"),
  },
  {
    name: "tool",
    path: "/tool",
    component: () => (
      <template>
        <div>this is tool</div>
      </template>
    ),
  },
  {
    name: "fixed-assets",
    path: "/fixed-assets",
    component: () => (
      <template>
        <div>this is overfixed assets</div>
      </template>
    ),
  },
  {
    name: "salary",
    path: "/salary",
    component: () => (
      <template>
        <div>this is salary</div>
      </template>
    ),
  },
  {
    name: "tax",
    path: "/tax",
    component: () => (
      <template>
        <div>this is tax</div>
      </template>
    ),
  },
  {
    name: "price",
    path: "/price",
    component: () => (
      <template>
        <div>this is price</div>
      </template>
    ),
  },
  {
    name: "composition",
    path: "/composition",
    component: () => (
      <template>
        <div>this is composition</div>
      </template>
    ),
  },
  {
    name: "Ngân sách",
    path: "/budget",
    component: () => (
      <template>
        <div>this is budget</div>
      </template>
    ),
  },
  {
    name: "report",
    path: "/report",
    component: () => (
      <template>
        <div>this is report</div>
      </template>
    ),
  },
  {
    name: "finance",
    path: "/finance",
    component: () => (
      <template>
        <div>this is finance</div>
      </template>
    ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_path),
  routes,
});

export default router;
