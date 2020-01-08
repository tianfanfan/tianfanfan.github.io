#### 为什么 js 里使用了await 的方法必须定义成 async 的
[为什么js里使用了await 的方法必须定义成async的](https://www.zhihu.com/question/308089255/answer/963408684)

其实开始回答这个问题时候，我本能感觉，这问题没意义，原因很简单，这个问题归根结底就六个字：语言语法规定。问出这个问题，提问者本身对 `JS` 语言了解程度不够高，或者对其历史了解不够。就像问你声明变量为什么要加 `var` 一样，该问题毫无意义。

后来在一个技术群里，讨论到这个话题，提出了一个深层次的问题 **语法为什么要这么定义**。

#### 语法为什么要这么定义

说起 `JS` ，历史长河滚滚流。它已经不是以前那个 `JS` 了。

以前的 `JS` ，异步靠回调，函数只有 `function` 声明，或者 `new Function` 构造，甚至 `new Function` 用的都很少，（`require` 就是用的 `new Function`，还有一些不良开发者，挖矿代码用，因为其本身可以隐藏自己的实现）。

随着语言发展，语法本身必然会带来新特征， `JS` 的改变很多，其中比较出名的（有用的）包括但不限于， `ES7` 的 `promise` ，以及后续加入了异步函数，就是 问题 1 中的 `async` 函数，（这里就不讨论中间的一系列语法草案的新增和修改了）

最终确定版 `async function` ，写法很简单。

```js
const asyncFn1 = async ()=>{}
const asyncFn2 = async function(){}
async function asyncFn3(){}

```

[async function 语法参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)

语法标准上， 异步函数只是把普通函数加一个 `async` 关键字而已。它的返回值是一个 `promise`。只有它里面可以使用 `await` ，用来等待另一个 `promise` 的完成。

从语法设计角度出发，设计一门计算机语言的语法，本身就是一项，没有非常准确标准可遵循的工作，所以才有标准组织来一起商定。一个人考虑是有考虑不全的时候。但是一个组织来定义，那么语言的合理性就非常高了，虽然也有考虑不周的时候，但不会妄自定义。

正是因为争议，导致 `async function` 虽然很早提出，但很晚才到 `stage 3`。而且到今天（2020年1月5日），依旧很多问题不可不争。

来看看已经确定以及没确定的，需要注意的一些细节。

#### 语法的细节

1. await 后跟 promise 实例

  > Description

  > An async function can contain an await expression that pauses the   execution of the async function to wait for the passed Promise's  resolution, then resumes the async function's execution and evaluates as   the resolved value.

  MDN 文档对这一部分的中文翻译有一定的出入，关键在于 `as the resolved value`，也就是 `await` 它只处理后面的 `promise resolve` 的情况。

+ await 后跟数字等一些常值
  ```js
  async function foo() {
    var d = await 1
    console.log(d)
  }
  console.log(2)
  foo()
  console.log(3)
  // 打印顺序，2 3 1
  ```
  关于这部分标准，对不起，还不存在。

  但已经实现的浏览器看来，是把它包装成了 `promise` ，依旧会触发异步，相当于写 `Promise.resolve(1)`。

  上文说道 `await` 只处理 `promise resolved` 的情况，那错误处理该如何做流程控制呢？

#### async / await 语法中遇到错误的情况

这里不分析，语法使用错误。

```js
// 第一种
const bar = ()=>{
  throw 3
  // or throw new Error('message: 3')
}

async function foo() {
    var d = await bar()
    return 2
}
var result = foo()
// output: result Promise {<rejected>: 3}

// throw 的情况
// Promise {<rejected>: Error: message: 3
// at bar (<anonymous>:3:9)
// at foo (<anonymous>:7:19)
// at <anonymous>:10:…}
```


```js
// 第二种
const bar = ()=>{
  return new Promise((resolve, reject)=>{
    throw 3
    // or throw new Error('message: 3')
  })
}

async function foo() {
    var d = await bar()
    return 2
}
var result = foo()
// output: result Promise {<rejected>: 3}

// throw 的情况
// output: Promise {<rejected>: Error: message: 3
// at <anonymous>:4:11
// at new Promise (<anonymous>)
// at bar (<anonymous>:…}
```

```js
// 第三种
const bar = ()=>{
  return new Promise((resolve, reject)=>{
    reject(3)
    // reject(new Error('message: 3'))
  })
}

async function foo() {
  var d = await bar()
  return 2
}
var result = foo()
// output: result Promise {<rejected>: 3}

// new Error 的情况
// output: Promise {<rejected>: Error: message: 3
    // at <anonymous>:3:12
    // at new Promise (<anonymous>)
    // at bar (<anonymous>:…}
```
这里要说明一下：

```js
const bar = ()=>{
  return new Promise((resolve, reject)=>{
    throw new Error('message: 3')
  })
}
const result = bar()
// result: Promise {<rejected>: Error: message: 3
// at <anonymous>:3:11
// at new Promise (<anonymous>)
// at bar (<anonymous>:…}
```
在 `new Promise` 里面直接抛错，`new Promise` 是有返回值的，其值为讲抛出的错误对象，作为 `value` 包装成 `promise` 实例。

可以看出， `async/await` 语法里面，无论 `await` 后面是 `promise reject` 出来的，还是任何其他情况 `throw` 出来的，无论你是 `Error` 类，还是 `Number` 还是其他任何东西。都处理成了直接停止。`promise.reject(xxx)` 和直接 `throw xxx` 并无差别。

在 `async/await` 语法中， `await` 后面跟的只要不是 `promise resolved` （或者 `pending` 将来是 `resolved` ）的，都认为是运行错误（注意不是语法错误）。都会直接中断 `async` 函数代码执行，并且 `async` 函数会返回一个 `rejected` 的 `promise` 将你的错误对象作为 `value` 返回。


同样，`async/await` 语法中，任何的 `throw` 也会直接中断函数执行，直接结束，返回一个 `rejected` 的 `promise` 将你的错误对象作为 `value` 返回。

也就是说，它混淆了 `promise.reject` 和 `throw` 的错误流程处理。

让在当前函数就地处理错误异常变得异常艰难，不知道是该用 `try/catch` 还是 `promise.catch` 。

#### async / await 语法中的错误处理

常见的错误处理，`JS` 是使用 `try/catch` 来捕获，如果想捕获全局错误，页面里面（简单办法 `window.onerror` 回调）

而在 `async/await` 里面，因为混淆了两者，错误处理显得非常难以控制。

试想一个场景，`await` 后面的表达式，出错了，应该如何处理。就像上一段中所示的几个场景。

1. 改写 promise 状态，扩展返回数据格式
  <!-- 插入 async 错误处理的链接 -->
[async/await 优雅的错误处理方法](https://zhuanlan.zhihu.com/p/79118227)
  ```js
  async function verifyUnique({ userCode }) {
    const { user } = this._db
    const [data, err] = await user
      .findOne({
        where: { userCode },
        attributes: ['id']
      })
      .then(
        (d) => [d, null],
        (e) => [null, e]
      )
    // 可以做其他数据处理，再返回
    return [data, err]
  }
  ```
  如文章所示的较好处理办法，将其转化成一个 `resolved` 的 `promise` ，并使用其 `err` 作为一个有效的 `resolved` 结果。让 `await` 始终接收一个 `resolved` 的 `promise` 。 `err` 就是错误对象，可以是 `new Error` 出来的，也可是` promise.reject(1)` 出来的这种任意类型。

  这段代码，有两个问题:

    1. 强制修改了 `promise` 的状态，让其换成 `resolved` 状态，并被 `await` 接受。虽然你能处理部分你可以处理的错误，但是却同时接收了你可能不能处理的错误。
    2. 你默认了 `findOne` 出来一定是一个 `promise` ，否则，你的 `.then` 执行就是错误的语法。

2. try / catch 就地处理，处理不了往上冒
  ```js
  const bar = ()=>{
    return new Promise((resolve, reject)=>{
      reject(3)
      // reject(new Error('message: 3'))
    })
  }
  async function foo() {
    try {
      const data = await bar()
      return data
    } catch (error) {
      // 对错误对象进行分析
      // 处理不了时候继续 throw
      console.log(error)
      throw error
    }
  }
  ```
  如上诉代码，在任何错误处理流程中都是正确的写法。 `catch` 里面的 `error` 对象，就是你 `reject` 插入的值。

  这段代码，有两个问题。
    1. 你会发现，又多了两层作用域，一个被 `try` 包住，一个被 `catch` 包住。这是 `try / catch` 避免不了的，也不算缺点。
    2. 你彻底抛弃了 `promise rejected` 、 `promise.then(fn,fn)` 、 `promise.catch(fn)` 这种流程控制。将其视为和其他情形的 error 是相同的处理流程。（例如：运算错误，或其他自定义的错误）也就意味着，任何错误，一并处理，都进 `catch` 处理。认为不该区分 `rejected` 的 `promise` 和 `throw` 的。而实际上是有区分的。不该如此。

#### 总结
  也许，你认为，`rejected` 就是异常啊，用只该用 `catch` 捕获。

  也许，你认为，`promise rejected` 的情况，混着 `error` 的里，异步函数这种处理，就是不对的做法，没法分辨。

  但目前而言，当你使用了异步函数时候，要么放弃 `rejected` 状态，要么放弃区分 `rejected` 和 `throw error`，默认 `rejected` 完全等于一个`error`。等于，你的错误逻辑，都是用 `error`。

  人们往往在遵循这规范，规定，约定，等，这些看起来靠谱，以后也一定靠谱的条目。

  当他发现这些规则，之间相互冲突，或者必须取舍的时候，开始怀疑规则。

  <!-- 就像马克思说的一句话，"怀疑一切"。 -->

#### 结束