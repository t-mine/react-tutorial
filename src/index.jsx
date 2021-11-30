import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      id={'square-' + props.index}
      onClick={props.onClick}
    >
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
        index={i}
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
          stepNumber: 0,
          squares: Array(9).fill(null),
          currentSquare: {
            col: null,
            row: null,
          },
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      order: 'asc',
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
          stepNumber: history.length,
          squares: squares,
          currentSquare: this.getCurrentSquare(i),
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    // どちらかが勝利した際に、勝利につながった 3つのマス目をハイライトする。
    if (calculateWinner(squares)) {
      const line = calculateWinner(squares).line;
      for (const val of line) {
        document.getElementById('square-' + val).classList.add('win-line');
      }
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleToggle = (e) => {
    this.setState({
      order: this.state.order === 'asc' ? 'desc' : 'asc',
    });
  };

  render() {
    const history = [].concat(this.state.history);
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares);
    const winner = result === null ? null : result.winner;

    if (this.state.order === 'desc') {
      history.sort((a, b) => {
        if (a.stepNumber > b.stepNumber) return -1;
        if (a.stepNumber < b.stepNumber) return 1;
        return 0;
      });
    }

    const moves = history.map((step) => {
      const historyIdx =
        this.state.order === 'desc' ? step.stepNumber - 1 : step.stepNumber;
      const desc = step.stepNumber //
        ? `Go to move #${step.stepNumber} col: ${history[historyIdx].currentSquare.col} row: ${history[historyIdx].currentSquare.row}`
        : 'Got to game start';
      if (this.state.stepNumber === step.stepNumber) {
        return (
          <li key={step.stepNumber}>
            <button
              onClick={() => this.jumpTo(step.stepNumber)}
              style={{ fontWeight: 'bold' }}
            >
              {desc}
            </button>
          </li>
        );
      } else {
        return (
          <li key={step.stepNumber}>
            <button onClick={() => this.jumpTo(step.stepNumber)}>{desc}</button>
          </li>
        );
      }
    });

    const toggle = () => {
      return (
        <div className="toggle-switch">
          <input
            id="toggle"
            className="toggle-input"
            type="checkbox"
            value="desc"
            onChange={(e) => this.handleToggle(e)}
          />
          <label htmlFor="toggle" className="toggle-label" />
        </div>
      );
    };

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (calculateDraw(current.squares)) {
      status = 'Draw';
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
      return {
        // O or X
        winner: squares[a],
        // 勝利につながった3つのマス目
        line: lines[i],
      };
    }
  }
  return null;
}

function calculateDraw(squares) {
  if (calculateWinner(squares)) {
    return false;
  }
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      return false;
    } else if (i === squares.length - 1) {
      return true;
    }
  }
  return false;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
