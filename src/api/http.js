import axios from 'axios';
import QS from 'qs';
import { MessageBox } from 'element-ui';

let CancelToken = axios.CancelToken;

let arrCancel = [];

// 请求超时时间
axios.defaults.timeout = 1130000;

axios.defaults.withCredentials = false; //让ajax携带cookie

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断


    //用于取消其它请求
    config.cancelToken = new CancelToken((c) => {
      arrCancel.push(c);
    });

    config.headers.Authorization = sessionStorage.getItem('Authorization') !== "undefined" ? JSON.parse(sessionStorage.getItem('Authorization')) : '';

    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


    return config;
  },
  error => {
    return Promise.error(error);

  });

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {

      if (response.data.code && (response.data.code == 300001 || response.data.code == 400036) && router.history.current.fullPath !== '/login') {
        //未登录、登录超时状态返回登录页
        MessageBox(response.data.msg);
        sessionStorage.clear();
        arrCancel.forEach((cancel) => {
          cancel();
        });
        router.push({ 'path': '/login' });
        clearNavData();
        arrCancel = [];
      } else {
        //正常登录状态
        return Promise.resolve(response);
      }

    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    //如果请求超时
    if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      let _timeOut = { code: 400000000, msg: '请求超时！', data: { code: 400000000, msg: '请求超时' } };
      return Promise.resolve(_timeOut);
    }
    //请求未超时，其它错误
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          });
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
        // MessageBox({
        //   message: '登录过期，请重新登录',
        //   duration: 1000,
        //   center: true
        // });
        // // 清除token
        // localStorage.removeItem('token');
        // store.commit('loginSuccess', null);
        // // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
        // setTimeout(() => {
        //   router.replace({
        //     path: '/login',
        //     query: {
        //       redirect: router.currentRoute.fullPath
        //     }
        //   });
        // }, 1000);
        // break;
        // 404请求不存在
        case 404:
          // MessageBox({
          //   message: '网络请求不存在',
          //   duration: 1500,
          //   center: true
          // });
          break;
        // 其他错误，直接抛出错误提示
        default:
          MessageBox({
            message: error.response.data.message,
            duration: 1500,
            center: true
          });
      }
      return Promise.reject(error.response);
    }
  }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    var getTimestamp = new Date().getTime();
    var _url = url + "?timestamp=" + getTimestamp;
    axios.get(_url,
      {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params, formate) {
  // defaultFormat={arrayFormat: 'repeat', allowDots: true};
  let defaultFormat = { skipNulls: true };
  defaultFormat.arrayFormat = formate && formate.arrayFormat ? formate.arrayFormat : 'repeat';
  defaultFormat.allowDots = formate && formate.allowDots ? formate.arrayFormat : true;

  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params, defaultFormat))
      .then(res => {
        if (res.data.code && res.data.code == 300001) {
          MessageBox({
            message: '登录过期，请重新登录',
            duration: 1000,
            center: true
          });
          sessionStorage.clear();
          router.replace({ 'path': '/login' });
        } else {
          resolve(res.data);
        }
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/**
 * post方法，对应post使用formate传参时的请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function postFormate(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        if (res.data.code && res.data.code == 300001) {
          MessageBox({
            message: '登录过期，请重新登录',
            duration: 1000,
            center: true
          });
          sessionStorage.clear();
          router.replace({ 'path': '/login' });
        } else {
          resolve(res.data);
        }

      })
      .catch(err => {
        reject(err.data)
      })
  });
}


/**
 * save方法，用于导出excel,pdf
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function save(url, _params, type = 'post', formate) {

  let defaultFormat = { skipNulls: true };
  defaultFormat.arrayFormat = formate && formate.arrayFormat ? formate.arrayFormat : 'repeat';
  defaultFormat.allowDots = formate && formate.allowDots ? formate.arrayFormat : true;
  if (type == 'post') {
    return new Promise((resolve, rejiect) => {
      axios.post(url, QS.stringify(_params, defaultFormat), {
        responseType: 'blob',
      })
        .then(res => {
          let data = res.data;
          let fileReader = new FileReader();
          fileReader.onload = function () {
            try {
              let jsonData = JSON.parse(this.result);
              if (jsonData.code) {
                // 说明是普通对象数据，后台转换失败
                resolve(jsonData);
              }
            } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              resolve(res.data);
            }
          };
          fileReader.readAsText(data);
        })
        .catch(err => {
          rejiect(err.data);
        })
    })
  } else {
    return new Promise((resolve, rejiect) => {
      axios({
        method: 'get',
        url: url,
        responseType: 'blob',
        params: _params
      })
        .then(res => {
          let data = res.data;
          let fileReader = new FileReader();
          fileReader.onload = function () {
            try {
              let jsonData = JSON.parse(this.result);
              if (jsonData.code) {
                // 说明是普通对象数据，后台转换失败
                resolve(jsonData);
              }
            } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              resolve(res.data);
            }
          };
          fileReader.readAsText(data);
        })
        .catch(err => {
          rejiect(err.data);
        })
    })
  }
}
