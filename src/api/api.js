/*接口管理*/
import { get, post, save, postFormate } from './http'
let host = process.env.API_ROOT;
// if (process.env.NODE_ENV === 'development') {
//     host = '/api'
//     // host = process.env.API_ROOT
//   } else {
//     host = process.env.API_ROOT
//   }

//商户管理--人保商户分页
export const findMerchantsByPage = parmas => get(host + '/merchants/findMerchantsByPage.json', parmas);
//商户管理--地址转经纬度
export const addressToLatAndLng = parmas => get(host + '/merchants/addressToLatAndLng.json', parmas);
//商户管理--所有的省
export const allProvince = parmas => get(host + '/merchants/allProvince.json', parmas);
//商户管理--所有的市
export const allCity = parmas => get(host + '/merchants/allCity.json', parmas);
//商户管理--启用或停用人保商户
export const enableOrDisable = parmas => post(host + '/merchants/enableOrDisable.json', parmas);
