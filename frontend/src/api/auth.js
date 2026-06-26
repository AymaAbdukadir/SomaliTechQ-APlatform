import api from "./axios";

export const login = (email, password) =>
  api.post("/auth/user/login", { email, password });

export const register = (name, email, password) =>
  api.post("/auth/user/singUp", { name, email, password });

export const getUserList = () => api.get("/auth/user/users");
