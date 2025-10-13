import { request } from "../services/api";

export function login(data) {
  return request({
    method: "post",
    url: "/api/user/login",
    data: data,
  });
}
