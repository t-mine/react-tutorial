import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]} //
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  render() {
    const boardArray = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];
    return (
      <div>
        {boardArray.map((row, rowIdx) => {
          return (
            <div className="board-row" key={rowIdx}>
              {row.map((value) => this.renderSquare(value))}
            </div>
          );
        })}
      </div>
    );
  }
}

export class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          currentSquare: {
            col: null,
            row: null,
          },
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  getCurrentSquare(i) {
    let col;
    let row;
    if ([0, 1, 2].includes(i)) {
      row = 1;
    } else if ([3, 4, 5].includes(i)) {
      row = 2;
    } else if ([6, 7, 8].includes(i)) {
      row = 3;
    }
    if ([0, 3, 6].includes(i)) {
      col = 1;
    } else if ([1, 4, 7].includes(i)) {
      col = 2;
    } else if ([2, 5, 8].includes(i)) {
      col = 3;
    }
    return {
      col: col,
      row: row,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          currentSquare: this.getCurrentSquare(i),
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move //
        ? `Go to move #${move} col: ${history[move].currentSquare.col} row: ${history[move].currentSquare.row}`
        : 'Got to game start';
      console.log(this.state.stepNumber);
      console.log(move);
      if (this.state.stepNumber === move) {
        return (
          <li key={move}>
            <button
              onClick={() => this.jumpTo(move)}
              style={{ fontWeight: 'bold' }}
            >
              {desc}
            </button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    });

    const toggle = ()=> {
      return (
        <div class="toggle-switch">
          <label>aaa</label>
          <input id="toggle" class="toggle-input" type='checkbox' />
          <label for="toggle" class="toggle-label"/>
        </div>
      )
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{toggle()}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
