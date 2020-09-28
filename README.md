# killglobal
kill global variable in project 

# 创作目地

# Useage - 使用说明
##### 使用npm安装:
``
  $ npm install killglobal
``
##### 使用1 navigateTo:

* page1/index.js

```
  import killglobal from "killglobal";
  const WX = killglobal.wx; // 获取微信版的实例
  const _page = WX.page({
    data:{},
    onLoad(){},
    bindTap(){ // 监听点击事件，跳转到page2
      let _options = {order_id:'1223',product_id:'1099'};
      let _largeData = {name:'koman',age:'99',address:'shanghai'};
      let _type = "page1 to page2";
      WX.router.navigateTo('/pages/page2/index', _options).withKGData(_largeData, _type);
    },
  });
  Page(_page);
```
* page2/index.js

```
  import killglobal from "killglobal";
  const WX = killglobal.wx;
  const _page = WX.page({
    data:{},
    onKGData(data,type){
      console.log(data) // {name:'koman',age:'99',address:'shanghai'}
      console.log(type) // "page1 to page2"
    },
    onLoad(options){
      console.log(options) // {order_id:'1223',product_id:'1099'}
    },

  });
  Page(_page);
```
#### navigateBack、redirectTo、reLaunch都可以传值

* page2/index.js

```
  import killglobal from "killglobal";
  const WX = killglobal.wx;
  const _page = WX.page({
    data:{},
    bindTap(){
      let _params = {moreData:{a:1,b:2}};
      WX.router.navigateBack(2).withKGData(_params);
      // WX.router.redirectTo("/pages/page1/index", {order:123}).withKGData(_params);
      // WX.router.reLaunch("/pages/page1/index").withKGData(_params);
    },
  });
  Page(_page);
```
* page1/index.js

```
  import killglobal from "killglobal";
  const WX = killglobal.wx; // 获取微信版的实例
  const _page = WX.page({
    data:{},
    onKGData(data){
      console.log(data) // {moreData:{a:1,b:2}};
    },
  });
  Page(_page);
```
