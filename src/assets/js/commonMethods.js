export default {
	logout() {
	  let removeToken = storeUser.mutations.removeToken;
	  removeToken();
	  sessionStorage.clear();
	  router.push({ path: '/login' });
	},
	getMessage(message, type = 'success', duration = 1500) {
	  Message({
	    message: message,
	    type: type,
	    duration: duration
	  });
	},
	clearObject(obj) {
	  for (let name in obj) {
	    obj[name] = '';
	  }
	  return obj;
	}
}


