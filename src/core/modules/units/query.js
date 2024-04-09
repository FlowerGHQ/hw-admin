export default {
    /**
     * @description 加密
     * @param value
     */
    stringifyQuery(value) {
        return btoa(
            encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }),
        );
    },
    /**
     * @description 解密
     * @param query
     */
    parseQuery(query) {
        return decodeURIComponent(
            atob(query)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(''),
        );
    },
};
