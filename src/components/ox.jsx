import { useState, useEffect } from 'react';
import { Button, Row, Col, Modal } from 'antd';
import axios from 'axios';

function Square({ value, on_square_click }) {
  return (
    <Button className="square" onClick={on_square_click} style={{ width: '60px', height: '60px' }}>
      {value}
    </Button>
  );
}

function Board({ squares, on_square_click }) {
  return (
    <>
      <Row>
        <Square value={squares[0]} on_square_click={() => on_square_click(0)} />
        <Square value={squares[1]} on_square_click={() => on_square_click(1)} />
        <Square value={squares[2]} on_square_click={() => on_square_click(2)} />
      </Row>
      <Row>
        <Square value={squares[3]} on_square_click={() => on_square_click(3)} />
        <Square value={squares[4]} on_square_click={() => on_square_click(4)} />
        <Square value={squares[5]} on_square_click={() => on_square_click(5)} />
      </Row>
      <Row>
        <Square value={squares[6]} on_square_click={() => on_square_click(6)} />
        <Square value={squares[7]} on_square_click={() => on_square_click(7)} />
        <Square value={squares[8]} on_square_click={() => on_square_click(8)} />
      </Row>
    </>
  );
}

const Game = ({ profile }) =>  {
  const [history, set_history] = useState([Array(9).fill(null)]);
  const [current_move, set_current_move] = useState(0);
  const [player_symbol, set_player_symbol] = useState(null); // X or O
  const [is_bot_turn, set_is_bot_turn] = useState(false);
  const [score, set_score] = useState(profile.score);
  const [win_streak, set_win_streak] = useState(0);
  const [is_modal_visible, set_is_modal_visible] = useState(false); // Modal state
  const [game_result, set_game_result] = useState(''); // Game result

  const current_squares = history[current_move];
  const bot_symbol = player_symbol === 'X' ? 'O' : 'X';
  const x_is_next = current_move % 2 === 0;

  const handleGameEnd = (finalScore) => {
    // Replace with your API URL
    axios.post('http://localhost:5001/update-score', {
        email: profile.email,
        score: finalScore
    })
    .then(response => {
        console.log('Score updated:', response.data);
    })
    .catch(error => {
        console.error('Error updating score:', error);
    });
};


  // Bot's move logic in useEffect
  useEffect(() => {
    if (is_bot_turn && !calculate_winner(current_squares)) {
      setTimeout(() => {
        handle_bot_move(current_squares.slice());
      }, 500);
    }
  }, [is_bot_turn]);

  // Check game result in useEffect
  useEffect(() => {
    const winner = calculate_winner(current_squares);
    if (winner) {
      check_game_result(winner === player_symbol ? 'player' : 'bot');
    } else if (!current_squares.includes(null)) {
      check_game_result('draw');
    }
  }, [current_squares]);

  function handle_play(next_squares) {
    const next_history = [...history.slice(0, current_move + 1), next_squares];
    set_history(next_history);
    set_current_move(next_history.length - 1);
    set_is_bot_turn(true);
  }

  function handle_click(i) {
    if (calculate_winner(current_squares) || current_squares[i]) {
      return;
    }

    const next_squares = current_squares.slice();
    next_squares[i] = player_symbol;
    handle_play(next_squares);
  }

  function handle_bot_move(next_squares) {
    const bot_winning_move = find_winning_move(next_squares, bot_symbol);
    if (bot_winning_move !== null) {
      next_squares[bot_winning_move] = bot_symbol;
      handle_play(next_squares);
      set_is_bot_turn(false);
      return;
    }

    const player_winning_move = find_winning_move(next_squares, player_symbol);
    if (player_winning_move !== null) {
      next_squares[player_winning_move] = bot_symbol;
      handle_play(next_squares);
      set_is_bot_turn(false);
      return;
    }

    const empty_squares = next_squares
      .map((square, index) => (square === null ? index : null))
      .filter(index => index !== null);

    const random_index = empty_squares[Math.floor(Math.random() * empty_squares.length)];
    next_squares[random_index] = bot_symbol;
    handle_play(next_squares);
    set_is_bot_turn(false);
  }

  function handle_reset() {
    set_history([Array(9).fill(null)]);
    set_current_move(0);
    set_player_symbol(null);
    set_is_bot_turn(false);
  }

  function handle_symbol_choice(symbol) {
    set_player_symbol(symbol);
    set_history([Array(9).fill(null)]);
    set_current_move(0);
    set_is_bot_turn(symbol === 'X'); // If player chooses 'X', bot starts
  }

  function check_game_result(winner) {
    if (winner === 'player') {
      let new_score = score + 1;
      let new_streak = win_streak + 1;

      if (new_streak === 3) {
        new_score += 1; // Bonus point for 3 consecutive wins
        new_streak = 0;
      }

      set_score(new_score);
      set_win_streak(new_streak);
      handleGameEnd(new_score);
    } else if (winner === 'bot') {
      set_score(score - 1);
      set_win_streak(0); // Reset win streak on loss
      handleGameEnd(score - 1);
    }

   
    
    // Set modal and result
    set_game_result(winner === 'draw' ? 'Draw' : winner === 'player' ? 'Player Wins!' : 'Bot Wins!');
    set_is_modal_visible(true);
  }

  const handle_modal_ok = () => {
    set_is_modal_visible(false);
    handle_reset();
    const new_player_symbol = player_symbol === 'X' ? 'O' : 'X';
    set_player_symbol(new_player_symbol);
    if (new_player_symbol === 'X') {
      set_is_bot_turn(true); // Bot starts if player is 'X'
    }
  };

  if (!player_symbol) {
    return (
      <div className="game">
        <div className="game-info">
          <div>Choose your symbol:</div>
          <Button type="primary" ghost onClick={() => handle_symbol_choice('O')}>Play as O</Button>
          <Button  danger style={{margin:'2%'}} onClick={() => handle_symbol_choice('X')}>Play as X</Button>
        </div>
      </div>
    );
  }

  let status = 'Next player: ' + (x_is_next ? 'X' : 'O');

  return (
    <>
      <Row justify="center" align="center">
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} style={{ padding: '3%' }}>
          <Board squares={current_squares} on_square_click={handle_click} />
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} style={{ padding: '3%' }}>
          <div className="status">{status}</div>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <p>Score: {score}</p>
          <div>Win Streak: {win_streak}</div>
          <br />
          <Button onClick={handle_reset}>Reset Game</Button>
        </Col>
      </Row>
      <Modal
        title="Game Over"
        visible={is_modal_visible}
        onOk={handle_modal_ok}
        cancelButtonProps={{ style: { display: 'none' } }} 
      >
        <p>{game_result}</p>
      </Modal>
    </>
  );
}

function find_winning_move(squares, symbol) {
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
    if (squares[a] === symbol && squares[b] === symbol && squares[c] === null) {
      return c;
    } else if (squares[a] === symbol && squares[c] === symbol && squares[b] === null) {
      return b;
    } else if (squares[b] === symbol && squares[c] === symbol && squares[a] === null) {
      return a;
    }
  }

  return null;
}

function calculate_winner(squares) {
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
export default Game;