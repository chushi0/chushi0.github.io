window.cszt0 = (window.cszt0 || {});
window.cszt0.URL = function () {
    let o = {};
    o.getSearch = () => {
        let search = window.location.search
        let r = {};
        if (search.startsWith("?")) {
            search = search.substring(1);
        }
        for (let a of search.split("&")) {
            let eq = a.indexOf("=");
            if (eq == -1) {
                r[decodeURI(a)] = "";
                continue;
            }
            let k = a.substring(0, eq);
            let v = a.substring(eq + 1);
            r[decodeURI(k)] = decodeURI(v);
        }
        return r;
    }
    return o;
}();