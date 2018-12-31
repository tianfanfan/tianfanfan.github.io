/*返回一个一定时间内完成的 promise*/

const creatAPromise = time => {
  return new Promise(resolve => requestAnimationFrame(resolve))
  // return new Promise(resolve => setTimeout(resolve, time || 0))
}
const getRandomColor = () => {
  let r0To255 = () => _.random(0, 255)
  let rDiaphaneity = () => _.random(0.5, 1, true).toFixed(2)
  return `rgba(${r0To255()},${r0To255()},${r0To255()},${rDiaphaneity()})`
}
class OnePiece {
  constructor({ el, x, y, size, chess }) {
    this.autoDownState = null
    this.timer = null
    this.el = el
    // 设置的 棋盘大小
    this.x = x
    this.y = y
    this.size = size
    // 所在棋盘
    this.chesss = []
    // canvas 的 DOM 元素
    this.elCanvas = null
    // 旋转角度
    this.rotateDeg = 0
    // 碎片的 2d 的数据数组
    this.piece2dDataArray = []
    // 左上角的点位
    this.position = {
      x: 0,
      y: 0
    }
  }
  autoInit() {
    this.setctx()
      .build2DArray()
      .drawPic()
    return this
  }
  randomOnePieceData() {
    /*随机生成方块的坐标*/
    var randomNum = _.random(0, 7)
    const resultMap = {
      0: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
      1: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
      2: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
      3: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
      4: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
      5: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
      6: [[1, 1], [1, 1]],
      7: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
    }
    return resultMap[randomNum]
  }

  // 装载到 chess 上，只接收 chess 实例
  addChess(chess) {
    if (!this.chesss.includes(chess)) {
      this.chesss.push(chess)
      chess.addPiece(this)
    }
  }
  setctx() {
    let elId = this.el
    var elCanvas = document.querySelector(elId) || document.getElementById(elId)
    elCanvas.width = 0
    elCanvas.height = 0
    this.ctx = elCanvas.getContext('2d')
    this.elCanvas = elCanvas
    return this
  }
  startDown(speed) {
    // 开始下落
    this.autoDownState = true
    this.timer = setInterval(() => {
      if (this.getCanDownState()) {
        this.pullDown()
      } else {
        clearInterval(this.timer)
      }
    }, speed | 500)
  }
  build2DArray() {
    // 创建 2D 数组数据和定位数据
    this.piece2dDataArray = this.randomOnePieceData()
    this.elCanvas.width = this.size * this.piece2dDataArray.length
    this.elCanvas.height = this.size * this.piece2dDataArray[0].length
    return this
  }
  drawPicDotByCoordinateAndColor(x, y, color) {
    let ctx = this.ctx
    let size = this.size
    ctx.fillStyle = color
    ctx.fillRect(x * size, y * size, size, size)
    return this
  }
  changeDomPosition() {
    let size = this.size
    // debugger
    this.elCanvas.style.transform = `translateX(${this.position.x *
      size}px) rotate(0deg) translateY(${this.position.y * size}px)`
    // this.elCanvas.style.left = this.position.x * size + 'px'
    // this.elCanvas.style.top = this.position.y * size + 'px'
  }
  async drawPic() {
    let piece2dDataArray = this.piece2dDataArray
    // 第一次先设置位置，再画 canvas
    this.changeDomPosition()
    for (let i = 0; i < piece2dDataArray.length; i++) {
      let arrII = piece2dDataArray[i]
      for (let j = 0; j < arrII.length; j++) {
        let value = arrII[j]
        let color
        if (value === 1) {
          /**
           * TODO: 写格子有数据时候的颜色，需要从外设置
           */
          color = `rgb(0,0,0)`
          this.drawPicDotByCoordinateAndColor(i, j, color)
        } else {
          color = `rgb(255,255,255)`
        }
      }
    }
    await creatAPromise()
  }
  rotate(chessArray) {}
  getCanDownState() {
    let pX = this.position.x
    let pY = this.position.y
    let x = this.x
    let y = this.y
    if (pX >= x || pY >= y) {
      // 剪枝
      return false
    }
    return true
    // 一个 piece 只存在于一个 chess 里面
    this.chesss.every((chess, index) => {
      console.log(chess)
    })
  }
  async pullDown() {
    // 放下
    this.setPosition({
      x: this.position.x,
      y: this.position.y + 1
    })

    await creatAPromise()
    return this
  }
  async moveLeft() {
    this.setPosition({
      x: this.position.x + 1,
      y: this.position.y
    })
    await creatAPromise()
    return this
  }
  setPosition({ x, y }) {
    let oldx = this.position.x
    let oldy = this.position.y
    this.position.x = x
    this.position.y = y
    if (oldx !== x || oldy !== y) {
      // 一定重定义位置
      this.changeDomPosition()
    }
  }
  deepPullDown() {
    if (this.getCanDownState()) {
      // 放下
      this.position.y = this.position.y + 1
      this.deepPullDown()
    }
  }
  canLeft(chessArray) {}
  canRight(chessArray) {}
  canRotate(chessArray) {}
}

class CanvasTetris {
  constructor({ el, x, y, size, bgcArray }) {
    // super()
    /*横纵个数*/
    this.el = el
    this.x = x
    this.y = y
    this.size = size
    // 背景候选颜色
    this.bgcArray = bgcArray
    // 设置 canvas context  // 初始化 2d 棋盘格的数组
    this.pieces = []
  }
  autoInit() {
    // 生成背景颜色数组
    this.creatBGCArray(2)
      // 生成 canvas 上下文
      .setctx()
      // 生成棋盘 2d 数组格式化
      .buildTetrisChess2DArray()
      // 绘制 2D 图片
      .drawTetrisChess()
    return this
  }
  addPiece(piece) {
    if (!this.pieces.includes(piece)) {
      this.pieces.push(piece)
      piece.addChess(this)
    }
  }
  creatBGCArray(length) {
    // 可提供 length 或者自己给颜色数组
    length = length > 1 ? length : 2
    this.bgColorArray =
      this.bgcArray && this.bgcArray.length >= 2
        ? this.bgcArray
        : new Array(length).fill(0).map(v => getRandomColor())
    return this
  }

  setctx() {
    let elId = this.el
    var elCanvas = document.querySelector(elId) || document.getElementById(elId)
    elCanvas.width = this.x * this.size
    elCanvas.height = this.y * this.size
    this.ctx = elCanvas.getContext('2d')
    return this
  }

  buildTetrisChess2DArray() {
    let x = this.x
    let y = this.y
    this.tetrisChess2DArray = new Array(x).fill(0).map(() => new Array(y).fill(0))
    // console.table(this.tetrisChess2DArray)
    return this
  }
  buildTetrisChess1DArray() {
    let x = this.x
    let y = this.y
    let blockCoordinateArray = []
    for (let j = 0; j < y; j++) {
      for (let i = 0; i < x; i++) {
        blockCoordinateArray.push(`${x},${j}`)
      }
    }
    this.blockCoordinateArray = blockCoordinateArray
    return this
  }

  drawPicDotByCoordinateAndColor(x, y, color) {
    let ctx = this.ctx
    let size = this.size
    ctx.fillStyle = color
    ctx.fillRect(x * size, y * size, size, size)
    return this
  }

  async drawOutLine(lineWidth) {
    // 绘制棋盘轮廓
    let ctx = this.ctx
    let x = this.x
    let y = this.y
    let size = this.size
    ctx.lineWidth = lineWidth || 1
    ctx.lineCap = 'round'
    ctx.strokeStyle = getRandomColor()
    for (let i = 0; i < x; i++) {
      const dx = i * size
      ctx.beginPath()
      ctx.moveTo(dx, 0)
      ctx.lineTo(dx, y * size)
      ctx.stroke()
    }
    for (let j = 0; j < y; j++) {
      const dy = j * size
      ctx.beginPath()
      ctx.moveTo(0, dy)
      ctx.lineTo(x * size, dy)
      ctx.stroke()
    }
    return this
  }
  async drawTetrisChess() {
    /*绘制底层棋盘*/
    let x = this.x
    let y = this.y
    let tetrisChess2DArray = this.tetrisChess2DArray
    let bgColorArray = this.bgColorArray
    let colorArrayLength = bgColorArray.length
    for (let i = 0; i < tetrisChess2DArray.length; i++) {
      let arrII = tetrisChess2DArray[i]
      for (let j = 0; j < arrII.length; j++) {
        let value = arrII[j]
        let color
        if (value === 1) {
          // TODO 写格子有数据时候的颜色
          color = `rgb(0,0,0)`
        } else {
          color = bgColorArray[(i * (y - 1) + j) % colorArrayLength]
        }
        this.drawPicDotByCoordinateAndColor(i, j, color)
        // await creatAPromise()
      }
    }
    this.drawOutLine()
  }
}
let tetrisFoo = new CanvasTetris({
  el: '#chess',
  x: 10,
  y: 20,
  size: 20,
  bgcArray: ['']
})
let pieceBar = new OnePiece({
  el: '#onepiece',
  x: 10,
  y: 20,
  size: 20
})
tetrisFoo.autoInit()
pieceBar.autoInit()
