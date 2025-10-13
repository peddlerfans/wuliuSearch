import { request } from "../services/api";

export function staffList(data) {
  return request({
    method: "post",
    url: "/api/user/tradeOrderList",
    data: data,
  });
}

export function staffDetail(data) {
  return request({
    method: "post",
    url: "/api/user/tradeOrderInfo",
    data: data,
  });
}
