# killglobal
kill global variable in project 

# 创作目地

# Useage - 使用说明
##### 使用npm安装:
``
  $ npm install killglobal
``
##### 使用:

* page1/index.js
``
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
``
* page2/index.js
``
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
``
