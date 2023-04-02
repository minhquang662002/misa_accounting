import store from "@/store";

export const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "https://apidemo.laptrinhweb.edu.vn/api/v1"
    : "idontknow";

export const showToast = (type, text) => {
  store.commit("pushToast", {
    type,
    text,
  });
};
