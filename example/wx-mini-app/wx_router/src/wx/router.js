// Richie Guo 2020-09-16
// 编码参数格式 {a:1,b:2,c:3} => ?a=1&b=2&c=3 用于url传参

import LIB from '../lib/index';
const {
    KillGlobal_EncodeParams,
    KG_GetUniqueCode,
    KG_TYPE_BACK, // 返回
    KG_TYPE_NAVIGATETO, // push
    KG_TYPE_RELAUNCH, // 重启
    KG_TYPE_REDIRECT, // 重定向
    KG_DATA_TAG, // options中的标示，用来获取key
    KG_OPTIONS_KEY, // options中的标示，用来获取key
    KG_OPTIONS_TYPE_KEY, // options中的标示，用来获取key
    KG_NUL_VALUE, //options表示空的标示
    KG_DataPool, // 数据池
    KG_TranslateData,
    KG_InsertKeyToParams,
    KG_DefineReadOnlyProperty,
} = LIB;
let _share_wx_router = null;

function _WX_KGRouter() {
    const _property = {
        navigateTo(url, params) { // 进入下一个页面  url：地址, params：参数
            const _params = KG_InsertKeyToParams(params, KG_TYPE_NAVIGATETO);
            wx.navigateTo({ url: `${url}${KillGlobal_EncodeParams(_params, url)}` });
            return new KG_TranslateData(_params[KG_OPTIONS_KEY]);
        },
        redirectTo(url, params) { // 重定向  url：地址, params：参数
            const _params = KG_InsertKeyToParams(params, KG_TYPE_REDIRECT);
            wx.redirectTo({ url: `${url}${KillGlobal_EncodeParams(_params, url)}` });
            return new KG_TranslateData(_params[KG_OPTIONS_KEY]);
        },
        reLaunch(url, params) { // 重启到某个页面 url：地址, params：参数
            const _params = KG_InsertKeyToParams(params, KG_TYPE_RELAUNCH);
            wx.reLaunch({ url: `${url}${KillGlobal_EncodeParams(_params, url)}` });
            return new KG_TranslateData(_params[KG_OPTIONS_KEY]);
        },
        navigateBack(delta = 1) { // 返回某个页面
            const _pages = getCurrentPages();
            let _ind = _pages.length - delta - 1;
            _ind = _ind > -1 ? _ind : 0;
            _ind = _ind > _pages.length - 1 ? _pages.length - 1 : _ind;
            const _page = _pages[_ind]; // 目地页面
            const _key = _page[KG_OPTIONS_KEY]; // 目地页面的key
            wx.navigateBack({ delta });
            return new KG_TranslateData(_key, _page, KG_TYPE_BACK);
        },
        getDataFromPool(key) { // 获取数据
            if (!key || key === KG_NUL_VALUE) return '';
            const _data = KG_DataPool[key];
            delete KG_DataPool[key]; // 从数据池删除数据
            return _data;
        },
        get optionsKey() {
            return KG_OPTIONS_KEY;
        },
        get optionsTypeKey() {
            return KG_OPTIONS_TYPE_KEY;
        },
        get optionsNull() {
            return KG_NUL_VALUE;
        },
        get dataTag() {
            return KG_DATA_TAG;
        },
        get getUniqueCode() {
            return KG_GetUniqueCode;
        },
        get encodeUrlParams() { // 将参数编码为字符串
            return KillGlobal_EncodeParams
        },
        get push() { // navigateTo别名1
            return this.navigateTo;
        },
        get goto() { // navigateTo别名2
            return this.navigateTo;
        },
        get redirect() { // 重定向 别名
            return this.redirectTo;
        },
        get back() { // 返回 别名
            return this.navigateBack;
        },
    };
    this.init = function() {
        KG_DefineReadOnlyProperty(this, _property);
        return this;
    }
}
class WX_KGRouter {
    static shareInstace = function() {
        if (!_share_wx_router) {
            _share_wx_router = (new _WX_KGRouter()).init();
        }
        return _share_wx_router;
    }
}

export default WX_KGRouter;
