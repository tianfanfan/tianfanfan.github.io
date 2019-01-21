class Tetris {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.table = new Array(x).fill(0).map(() => new Array(y).fill(0))
    console.table(this.table)
  }
}

class Piece {
  constructor () {
    var randomNum = _.random(0, 7)
    const resultMap = {
      0: [[1, 0], [1, 0], [1, 0], [1, 0]],
      // 0: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
      1: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
      2: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      3: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]],
      4: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
      5: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
      6: [[1, 1], [1, 1]],
      7: [[0, 1], [0, 1], [0, 1], [0, 1]]
      // 7: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
    }
    this.dx = 3
    this.dy = 0
    console.table(resultMap[randomNum])
    this.pieceArray = resultMap[randomNum]
  }
  downOneStep () {
    this.dy = this.dy + 1
  }
}

class CanvasDrawer {
  constructor (elId, x, y, size) {
    this.elId = elId
    this.size = size
    this.x = x
    this.y = y
    const elCanvas = document.getElementById(elId)
    elCanvas.width = this.x * this.size
    elCanvas.height = this.y * this.size
    this.ctx = elCanvas.getContext('2d')
  }
  draw (tetrisTableArray, pieceArray, pieceDx, pieceDy) {
    // const colorArray = [`rgb(0,0,0)`, `rgb(255,255,255)`]
    const bgcArray = [`#B0C4D9`, `#D6D9B0`]
    // const
    const pieceColor = `rgba(0, 0, 0, 0.5)`
    const tableColor = `rgba( 0, 0, 0, 0.75)`
    tetrisTableArray.forEach((arr2, i) => {
      arr2.forEach((value, j) => {
        this.drawPicDotByCoordinateAndColor(i, j, bgcArray[((i + 1) + (j + 1)) % 2])
        if (value == 1) {
          this.drawPicDotByCoordinateAndColor(i, j, tableColor)
        }
        if (pieceArray && pieceArray[i - pieceDx] && pieceArray[i - pieceDx][j - pieceDy] && pieceArray[i - pieceDx][j - pieceDy] == 1) {
          this.drawPicDotByCoordinateAndColor(i, j, pieceColor)
          console.log('-------')
        }
      })
    });
  }
  drawPicDotByCoordinateAndColor (x, y, color) {
    let ctx = this.ctx
    let size = this.size
    ctx.fillStyle = color
    ctx.fillRect(x * size, y * size, size, size)
  }
}

const tetris = new Tetris(10, 20)

const canvasDrawer = new CanvasDrawer('picture', 10, 20, 10)
const piece = new Piece()
canvasDrawer.draw(tetris.table, piece.pieceArray, piece.dx, piece.dy)
// piece.downOneStep()
// canvasDrawer.draw(tetris.table, piece.pieceArray, piece.dx, piece.dy)