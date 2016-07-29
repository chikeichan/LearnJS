/**
  Minesweeper Model Class
*/
class MinesweeperModel {
  constructor(numOfRows, numOfCols, numOfMines) {
    const length = numOfRows * numOfCols;
    this.row = numOfRows;
    this.col = numOfCols;
    this.mines = numOfMines;
    this.field = this.makeField(numOfRows, numOfCols, numOfMines);
    this.isOpen = Array(length).fill(false);
    this.isFlag = Array(length).fill(false);
  }

  makeField(numOfRows, numOfCols, numOfMines) {
    let field = this.createFieldWithMines(numOfRows, numOfCols, numOfMines);
    field = this.addNumberIndicatorsToMines(field);
    return field;
  }

  createFieldWithMines(numOfRows, numOfCols, numOfMines) {
    const mines = Array(numOfMines).fill('M');
    const field = Array(numOfRows * numOfCols - numOfMines)
      .fill(0)
      .concat(mines);
    return this.shuffle(field);
  }

  shuffle(array) {
    var len = array.length;
    array.forEach(function(n, i) {
      var rand = Math.floor(Math.random() * len);
      var tmp = array[i];
      array[i] = array[rand];
      array[rand] = tmp;
    });
    return array;
  }

  addNumberIndicatorsToMines(field) {
    return field.map((cell, i) => {
      return cell === 'M' ? 'M' :
        this.getSurroundIndex(i, field)
          .map(i => field[i])
          .reduce((sum, n) => n === 'M' ? sum + 1 : sum, 0)
    });
  }

  getSurroundIndex(i) {
    let indices = [];
    const rightEdge = !((i + 1) % this.col);
    const leftEdge = !(i % this.col);
    const upEdge = i < this.col;
    const downEdge = i >= this.col * (this.row - 1);

    return [
      !rightEdge && i + 1,
      !downEdge && i + this.row,
      !rightEdge && !downEdge && i + 1 + this.row,
      !rightEdge && !upEdge && i + 1 - this.row,
      !leftEdge && i - 1,
      !upEdge && i - this.row,
      !leftEdge && !upEdge && i - 1 - this.row,
      !leftEdge && !downEdge && i - 1 + this.row
    ];
  }

  toggle(i) {
    switch(true) {
      case (this.isOpen[i]):
      case (this.isFlag[i]):
        break;
      case (this.field[i] > 0):
      case (this.field[i] === 'M'):
        this.isOpen[i] = true;
        break;
      case (this.field[i] === 0):
        this.isOpen[i] = true;
        this.getSurroundIndex(i)
          .forEach(cell => this.toggle(cell));
      default:
        break;
    }
  }

  flag(i) {
    switch(true) {
      case (this.isOpen[i]):
        break;
      default:
        const flag = this.isFlag[i];
        this.isFlag[i] = !flag;
        break;
    }
  }
}

/**
  Minesweeper View Class
*/
class MinesweeperView {
  constructor(numOfRows, numOfCols) {
    this.row = numOfRows;
    this.col = numOfCols;
    this.onClick = null;
    this.rootElement = document.createElement('div');
  }

  render(field, opens, flags) {
    this.rootElement.innerHTML = '';

    for(let i = 0; i < this.row; i++) {
      const rowElement = document.createElement('div');
      rowElement.className = 'minesweeper-row';
        
      for(let j = 0; j < this.col; j++) {
        const cellIndex = i * this.row + j;
        const cellElement = document.createElement('button');

        cellElement.className = this.makeClassName(cellIndex, field, opens, flags);
        cellElement.addEventListener('click', e => this.onClick(e, cellIndex));
        cellElement.addEventListener('contextmenu', e => {
          e.preventDefault();
          this.onRightClick(e, cellIndex);
        });

        rowElement.appendChild(cellElement);
      }

      this.rootElement.appendChild(rowElement);
    }
  }

  update(field, opens, flags) {
    for(let i = 0; i < this.row; i++) {
      const rowElement = this.rootElement.childNodes[i];
      for(let j = 0; j < this.col; j++) {
        const cellIndex = i * this.row + j;
        const cellElement = rowElement.childNodes[j];
        cellElement.className = this.makeClassName(cellIndex, field, opens, flags);
      }
    }
  }

  makeClassName(i, field, opens, flags) {
    switch(true) {
      case flags[i]:
        return 'minesweeper-cell minesweeper-cell__flagged';
      case opens[i]:
        return `minesweeper-cell minesweeper-cell__clicked minesweeper-cell--${field[i]}`;
      default:
        return 'minesweeper-cell';
    }
  }
}

/**
  Minesweeper Controller Class
*/
class Minesweeper {
  constructor(x, y, n) {
    const minesweeper = new MinesweeperModel(10, 10, 20);
    const view = new MinesweeperView(10, 10);
    view.render(minesweeper.field, minesweeper.isOpen, minesweeper.isFlag);
    view.onClick = (e, i) => {
      minesweeper.toggle(i);
      view.update(minesweeper.field, minesweeper.isOpen, minesweeper.isFlag);
    };

    view.onRightClick = (e, i) => {
      minesweeper.flag(i);
      view.update(minesweeper.field, minesweeper.isOpen, minesweeper.isFlag);
    }
    this.el = view.rootElement;
    this.el.className = 'minesweeper';
  }
}

// var root = document.querySelector('#root');

// function make() {
//   root.appendChild(new Minesweeper(10, 10, 20).el);
// }














