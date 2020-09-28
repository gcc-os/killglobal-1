const _wx = require("./src/wx/index").default;

export default {
    get wx() { // 获取微信实例
        return _wx;
    },
}
