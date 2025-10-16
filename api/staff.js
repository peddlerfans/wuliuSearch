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

//确认运单
export function staffConfirm(data) {
  return request({
    method: "post",
    url: "/api/user/setResult",
    data: data,
  });
}

// 客户确认
export function customConfirm(data) {
  return request({
    method: "post",
    url: "/api/user/checkOrder",
    data: data,
  });
}

