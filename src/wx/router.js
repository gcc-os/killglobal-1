// Richie Guo 2020-09-16
// 编码参数格式 {a:1,b:2,c:3} => ?a=1&b=2&c=3 用于url传参

// return "?a=1&b=2&c=3"
function EncodeParams(params, url) { // *url可选，非必传
    let _params = '';
    if (params && typeof params == 'object') {
        let keys = Object.keys(params);
        for (let i = 0; i < keys.length; i++) {
            let _key = keys[i];
            if (i == 0) {
                if (url && url.indexOf('?') > -1) {
                    _params += `&${_key}=${params[_key]}`;
                } else {
                    _params += `?${_key}=${params[_key]}`;
                }
            } else {
                _params += `&${_key}=${params[_key]}`;
            }
        }
    }
    return _params;
}
const TYPE_BACK = "NAVIGATEBACK"; // 返回
const TYPE_NAVIGATETO = "NAVIGATETO"; // push
const TYPE_RELAUNCH = "RELAUNCH"; // 重启
const TYPE_REDIRECT = "REDIRECTTO"; // 重定向
const DATA_TAG = '_kill_global_data_tag_'; // options中的标示，用来获取key
const OPTIONS_KEY = '_kill_global_data_pool_key_'; // options中的标示，用来获取key
const OPTIONS_TYPE_KEY = '_kill_global_type_'; // options中的标示，用来获取key
const NUL_VALUE = '_kill_global_data_pool_key_null'; //options表示空的标示
const DataPool = {}; // 数据池
function GetUniqueCode() { // 获取唯的编码
    return `_data_pool_key_${parseInt(Math.random()*1000000)}`;
}

export function DeepCopy(data) { // *对象深拷贝
    if (!data) return '';
    if (typeof data != 'object') return data;
    if (Object.keys(data).length == 0) return data;
    let _data = JSON.stringify(data);
    return JSON.parse(_data);
}

function SetDataPool(data, key) { // 将数据放入数据池
    if (!data) return NUL_VALUE;
    let _key = key || GetUniqueCode();
    DataPool[_key] = data;
    const _options = {};
    _options[OPTIONS_KEY] = _key;
    return _options;
}

function TranslateData(options_key, page = '', type) { // 传输数据的对象
    this.type = type;
    this.targetPage = page;
    this.translateCode = options_key || NUL_VALUE;
    // *@param data: 数据
    // *@param tag: 标识 可选,一个page的onKGData可能会被很多page调用，这个tag用来标示数据来源
    this.withKGData = function(data, tag = '') { // 存储数据/传数据
        const _data = DeepCopy(data) // 拷贝data，防止互相干扰
        if (this.targetPage && this.targetPage.onKGData) {
            // 如果知道page，直接将数据传过去
            this.targetPage.onKGData(_data, tag || this.type);
            return;
        }
        _data[DATA_TAG] = tag;
        SetDataPool(_data, this.translateCode);
    }
}

const InsertKeyToParams = function(params, type) { // 向params中插入参数
    let _params = {};
    if (params && Object.keys(params).length > 0) {
        _params = Object.assign(_params, params);
    }
    _params[OPTIONS_KEY] = GetUniqueCode();
    _params[OPTIONS_TYPE_KEY] = type;
    return _params;
}

const KGRouter = {
    navigateTo(url, params) { // 进入下一个页面  url：地址, params：参数
        const _params = InsertKeyToParams(params, TYPE_NAVIGATETO);
        wx.navigateTo({ url: `${url}${EncodeParams(_params, url)}` });
        return new TranslateData(_params[OPTIONS_KEY]);
    },
    redirectTo(url, params) { // 重定向  url：地址, params：参数
        const _params = InsertKeyToParams(params, TYPE_REDIRECT);
        wx.redirectTo({ url: `${url}${EncodeParams(_params, url)}` });
        return new TranslateData(_params[OPTIONS_KEY]);
    },
    reLaunch(url, params) { // 重启到某个页面 url：地址, params：参数
        const _params = InsertKeyToParams(params, TYPE_RELAUNCH);
        wx.reLaunch({ url: `${url}${EncodeParams(_params, url)}` });
        return new TranslateData(_params[OPTIONS_KEY]);
    },
    navigateBack(delta = 1) { // 返回某个页面
        const _pages = getCurrentPages();
        let _ind = _pages.length - delta - 1;
        _ind = _ind > -1 ? _ind : 0;
        _ind = _ind > _pages.length - 1 ? _pages.length - 1 : _ind;
        const _page = _pages[_ind]; // 目地页面
        const _key = _page[OPTIONS_KEY]; // 目地页面的key
        wx.navigateBack({ delta });
        return new TranslateData(_key, _page, TYPE_BACK);
    },
    getDataFromPool(key) { // 获取数据
        if (!key || key === NUL_VALUE) return '';
        const _data = DataPool[key];
        delete DataPool[key]; // 从数据池删除数据
        return _data;
    },
    get optionsKey() {
        return OPTIONS_KEY;
    },
    get optionsTypeKey() {
        return OPTIONS_TYPE_KEY;
    },
    get optionsNull() {
        return NUL_VALUE;
    },
    get dataTag() {
        return DATA_TAG;
    },
    get getUniqueCode() {
        return GetUniqueCode;
    },
    get encodeUrlParams() { // 将参数编码为字符串
        return EncodeParams
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

// 添加back的快捷函数
// back1,back2,back3......,back8,back9,back10
// 依次返回1页,2页,3页......,8页,9页,10页
for (let delta = 1; delta <= 10; delta++) {
    const _fnName = `back${delta}`;
    KGRouter[_fnName] = function() {
        return KGRouter.back(delta);
    }
}

export default KGRouter;
