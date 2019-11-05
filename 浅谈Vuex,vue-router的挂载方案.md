### 初始化过程

#### vuex install

``````javascript
function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}


function applyMixin (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }


  function vuexInit () {
    var options = this.$options;
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
}
``````
#### vue-router install

``````js
function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}
``````
```js
var a = 1
```
vuex 的 install 函数和 vue-router 极其类似，第一步一样是验证是 install 过，如果执行过，就直接跳过，不同的是 vuex 会出警告，并结束。

后续 vuex 是使用了一个小封装 applyMixin ，而 vue-router 直接写在了一个函数里面，其实并没有多大差异。

在扩展类方法的实现上，都是使用 mixin 方法，大写的 Vue，构造函数的 Vue.mixin 方法。（其实也类似 面向对象的 extends）

并没有造出新的类，而是 mixin ，类似面向切片的 AOP 思想，将需要插入的部分逻辑抽离，将来再注入（也非常类似依赖注入思想）。

applyMixin 的 else 就不看了，这段代码完全是为了兼容 1.x 版本，直接进入 2.x 的逻辑。可以看到不约而同使用了组件 beforeCreate 的生命周期。这个生命周期是在全部生命周期的最前端，也就是连 data 都没造出来的情况，但是可以读取到上层传递下来的 $options。

在此处，两个库都做了一件事，如果拥有 router（或 store）键值，直接赋值给自己的 _routerRoot ($store)，如果没有，就从 panrent 取 _routerRoot ($store)。

``````js
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
``````

这样就把从顶层 Vue 实例括号里面放入的 store 和 router 传递下来，让所有的子组件都拥有了。

随后 vue-router 做了一件事，将常用的两个属性，一个包含了 router，route 给做了一个数据代理（Object.defineProperty）让组件更加方便的访问和操作 router。但是这里却改变了 Vue 构造函数。但是 vuex 并没做过多操作。实际上这种修改原型的方案确实是不太推荐，不过这里只是添加两个官方变量，还算可以接受。

同时，vue-router 将路由匹配到的 Vue 实例 RouterView 记录到了 matched 对象里面，registerRouteInstance 函数，以便进行分析，和更新操作。
