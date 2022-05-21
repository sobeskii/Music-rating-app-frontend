export const getCookie = function (name) {
    let cookie = {};
    document.cookie.split(';').forEach(function (el) {
        let [k, v] = el.split('=');
        cookie[k.trim()] = v;
    })

    if (cookie[name] != undefined) {
        return cookie[name];
    } else {
        return null;
    }
}
export const deleteCookie = function (name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}
export const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args)
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

export const showRequest = (request)=> {
    const reqObject = JSON.parse(JSON.stringify(request));
    console.log('request', reqObject);

    return reqObject;
};