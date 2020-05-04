import { MessageBox, Message } from 'element-ui';
import { get } from '../../api/http'
import Vue from 'vue'
export function getNowFormatDate() {
  let date = new Date();
  let seperator1 = "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}


export function getNowDefinedFormatDate(obj) {


  let date = new Date();
  let seperator1 = obj && obj.seperatorl ? obj.sepseperatorl : "-";
  let seperator1Time = obj && obj.seperator1Time ? obj.seperator1Time : ":";
  let formata = obj && obj.formata ? obj.formata : 'yy-mm-dd';


  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  let strHours = date.getHours();
  let strMinutes = date.getMinutes();
  let strSeconds = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (strHours >= 0 && strHours <= 9) {
    strHours = "0" + strHours;
  }
  if (strMinutes >= 0 && strMinutes <= 9) {
    strMinutes = "0" + strMinutes;
  }
  if (strSeconds >= 0 && strSeconds <= 9) {
    strSeconds = "0" + strSeconds;
  }
  let currentdata = '';
  switch (formata) {
    case "yy-mm-dd":
      currentdata = year + '-' + month + '-' + strDate + seperator1;
      break;
    case "yy-mm-dd hh:mm:ss":
      currentdata = year + '-' + month + '-' + strDate + ' ' + '' + strHours + ':' + strMinutes + ':' + strSeconds;
      break;
    case "hh:mm:ss":
      currentdata = strHours + ':' + strMinutes + ':' + strSeconds;
      break;
    default:
      currentdata = year + seperator1 + month + seperator1 + strDate + ' ' + strHours + seperator1Time + strMinutes + seperator1Time + strSeconds;
      break
  }
  return currentdata;

}

export function getMessageBox(message) {
  MessageBox(message, '提示', {
    confirmButtonText: '确定',
    showCancelButton: false,
    type: 'warning'
  }).catch(err => {

  })
}

export function getMessage(message, type = 'success', duration = 1500) {
  Message({
    message: message,
    type: type,
    duration: duration
  });
}

export function logout() {
  let removeToken = storeUser.mutations.removeToken;
  removeToken();
  sessionStorage.clear();
  router.push({ path: '/login' });
}


//清空对象值
export function clearObject(obj) {
  for (let name in obj) {
    obj[name] = '';
  }
  return obj;
}


//文件下载
export function downloadFile(codeData, fileName, type = 'application/vnd.ms-excel') {

  const blob = new Blob([codeData], {
    // 如何后端没返回下载文件类型，则需要手动设置：type: 'application/pdf;chartset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为vnd.ms-excel
    type: type,
  });


  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName)
  } else {
    const a = document.createElement('a');
    const herf = window.URL.createObjectURL(blob);
    // 下载链接
    a.href = herf;
    // 下载文件名,如果后端没有返回，可以自己写a.download = '文件.pdf'
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(herf);
  }
}

//本在上传图片
export function handleFileChange(event, item, sizeLimit = 3, callBack) {
  //更改当前图片显示
  if (!event.target.files[0]) return;
  let file = event.target.files[0];
  let delPicIds = [];
  //图片最大限制
  // let sizeLimit = 3;
  //如果图片大小超过限制，取消上传
  if ((file.size / 1024 / 1024) > sizeLimit) {
    getMessageBox('图片最大不能超过' + sizeLimit + 'M,请重新上传');
  } else {
    //如果是更改图片，把图片id存入删除图片id数组中
    if (item.imgId !== '' && delPicIds.indexOf(item.imgId) == -1) {
      delPicIds.push(item.imgId);
    }
    let url = null;
    if (window.createObjectURL != undefined) { // basic
      url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
      url = window.webkitURL.createObjectURL(file);
    }
    item.imgUrl = url;
    item.files = file;
    //重新渲染组件
    // this.reFrechPicList = false;
    // this.$nextTick(() => {
    //   this.reFrechPicList = true;
    // })
  }
}

// 能过url下载图片到本地 
export function downFileImage(img, name = "图片") {
  img.setAttribute("crossOrigin", "anonymous");
  img.onload = () => {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0, img.width, img.height);
    var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

    var a = document.createElement("a"); // 生成一个a元素
    var event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "photo"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
}


// 判断两个对象是否相等
export function isObjEqual(x, y) {
  // If both x and y are null or undefined and exactly the same 
  if (x === y) {
    return true;
  }

  // If they are not strictly equal, they both need to be Objects 
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }

  //They must have the exact same prototype chain,the closest we can do is
  //test the constructor. 
  if (x.constructor !== y.constructor) {
    return false;
  }

  for (var p in x) {
    //Inherited properties were tested using x.constructor === y.constructor
    if (x.hasOwnProperty(p)) {
      // Allows comparing x[ p ] and y[ p ] when set to undefined 
      if (!y.hasOwnProperty(p)) {
        return false;
      }

      // If they have the same strict value or identity then they are equal 
      if (x[p] === y[p]) {
        continue;
      }

      // Numbers, Strings, Functions, Booleans must be strictly equal 
      if (typeof (x[p]) !== "object") {
        return false;
      }

      // Objects and Arrays must be tested recursively 
      if (!Object.equals(x[p], y[p])) {
        return false;
      }
    }
  }

  for (p in y) {
    // allows x[ p ] to be set to undefined 
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
};

/**
* 检测图片是否存在
* @param url
*/
//let imageIsExist = function (url, img_id) {
//return new Promise((resolve) => {
//  var img = new Image();
//
//  img.onload = function () {
//    if (this.complete == true) {
//      //console.log('资源加载');
//      resolve(true);
//      img = null;
//    }
//  }
//  img.onerror = function () {
//    //console.log('资源error', img);
//    resolve(false);
//    img = null;
//  }
//  img.src = url;
//})
//};
//
//
//
//
//// 单独作用于应用模块的管理
//// 传的是错误的图片
//Vue.directive('err-img', async function (el, binding) {
////var fileHost = process.env.NODE_ENV === 'development' ? 'https://yishanol.cn/ysol_web_api/file/getNewUrl.json' : 'https://api.yishanol.com/file/getNewUrl.json';
//var fileHost = process.env.NODE_ENV === 'development' ? 'https://yishanol.cn/ysol_web_api/file/getNewUrl.json' : 'https://yishanol.cn/ysol_web_api/file/getNewUrl.json';
//let imgURL = binding.value;//获取图片地址
//let realURL = el.src;
//if (imgURL) {
//  let img_id = el.getAttribute('imgid')
//  //console.log(img_id)
//  let exist = await imageIsExist(realURL, img_id);
//  if (!exist) {
//    //console.log(imgURL);
//    get(fileHost, {
//      param: img_id
//    }).then(res => {
//      el.setAttribute('src', res.data);
//    })
//  }
//}
//});
