// const BASE_URL = 'http://testapi.lnsk.top' // TODO: 配置你的后端域名
const BASE_URL = 'https://djtestweb.youyong.org.cn' // TODO: 配置你的后端域名

export const BASEURL = BASE_URL

export function request({ method, url, data, options = {} }) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: Object.assign(
        {
          "Content-Type": "application/json",
          Authorization: appendAuthHeader(),
        },
        options.header || {}
      ),
      success: (res) => {
        if (res.statusCode == 200) {
          if (res.data.code == 0 || res.data.code == 200) {
            return resolve(res.data);
          } else if (res.data.code == 999994 || res.data.code == 999997) {
            uni.clearStorageSync();
            setTimeout(() => {
              uni.reLaunch({
                url: "/pages/loginPage/index?out=true",
              });
            }, 100);
            return reject(res.data);
          } else {            
            uni.showToast({
              title: res.data.msg,
              // title: t(String(res.data.code)),
              icon: "none",
              duration: 2000,
            });
            return reject(res.data);
          }
        } else if (res.statusCode == 401) {
          uni.clearStorageSync();
          uni.reLaunch({
            url: "/pages/loginPage/index",
          });
          return reject(res.data);
        } else {
          // 除200状态，均以reject状态返回
          return reject(res.data);
        }
      },
      fail: reject,
    });
  });
}

export const api = {
  get: (url, params, options) => request("GET", url, params, options),
  post: (url, body, options) => request("POST", url, body, options),
  put: (url, body, options) => request("PUT", url, body, options),
  delete: (url, body, options) => request("DELETE", url, body, options),
};

export function setBaseUrl(url) {
  /* 可运行时切换 */
}

function appendAuthHeader() {
  const token = uni.getStorageSync("token")
  return token ? `Bearer ${token}` : "";
}
