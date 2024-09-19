import { useState, useEffect } from 'react';
import { Button, Row, Col, Card } from 'antd';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';
import Modal from 'react-modal'; // Import react-modal
import '../App.css';

// Initialize Modal
Modal.setAppElement('#root');

function Square({ value, on_square_click }) {
  // Define the spring animation
  const props = useSpring({
    opacity: value ? 1 : 0, // Animate opacity based on whether the square has a value
    transform: value ? 'scale(1)' : 'scale(0.8)', // Animate scale for a pop-in effect
    config: { tension: 300, friction: 15 }, // Control the spring behavior
  });

  return (
    <animated.div style={props}>
      <Button
        className="square"
        onClick={on_square_click}
        style={{
          width: '90px',
          height: '90px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: ' #111 ',
          fontSize: '52px',
        }}
      >
        <h4 className= {value === 'O' ?'neonTextb':'neonTextP'}>{value}</h4>
      </Button>
    </animated.div>
  );
}
//style={{ color: value === 'O' ? '#FFF' : '#8C0724' }}
function Board({ squares, on_square_click }) {
  return (
    <div className="board-container" >
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
    </div>
  );
}


// Add CSS styles
const styles = `
.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #010a01;
  width: 300px;
  height: 300px;
  background-image: 
                    linear-gradient(#E92390 2px, transparent 2px),
                    linear-gradient(90deg, #E92390 2px,  transparent  2px);
  background-size: 99.33px 99.33px; /* Size of each square in the grid */
  position: relative;
  opacity:0.6;
}

.square {
  width: 99px;
  height: 99px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  margin: 3px; /* Adjust margin to fit within the grid */
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const Game = ({ profile }) => {
  const [history, set_history] = useState([Array(9).fill(null)]);
  const [current_move, set_current_move] = useState(0);
  const [player_symbol, set_player_symbol] = useState('O'); // X or O
  const [is_bot_turn, set_is_bot_turn] = useState(false);
  const [score, set_score] = useState(0);
  const [win_streak, set_win_streak] = useState(0);
  const [is_modal_visible, set_is_modal_visible] = useState(false); // Modal state
  const [game_result, set_game_result] = useState(''); // Game result
  const [stored_email, set_stored_email] = useState(localStorage.getItem('email') || profile.email); // Retrieve email from localStorage or use profile.email
  const [stored_name, set_stored_name] = useState(localStorage.getItem('name') || profile.name); // Retrieve name from localStorage or use profile.name

  const current_squares = history[current_move];
  const bot_symbol = player_symbol === 'X' ? 'O' : 'X';

  useEffect(() => {
    // Save profile.email and profile.name to localStorage
    if (profile.email) {
      localStorage.setItem('email', profile.email);
      set_stored_email(profile.email);
    }
    if (profile.name) {
      localStorage.setItem('name', profile.name);
      set_stored_name(profile.name);
    }
  }, [profile.email, profile.name]);

  useEffect(() => {
    if (current_move === 0 && player_symbol === 'X') {
      setTimeout(() => {
        handle_bot_move(history[0].slice()); // Bot makes the first move
      }, 500);
    }
  }, [is_bot_turn, current_move, player_symbol]);

  // Fetch updated profile from the server to get the new score
  useEffect(() => {
    if (stored_email) {
      const fetchUpdatedProfile = () => {
        axios.get(`http://localhost:5001/?email=${stored_email}`)
          .then(response => {
            const updatedProfile = response.data[0];
            set_score(updatedProfile.score);
          })
          .catch(error => {
            console.error('Error fetching updated profile:', error);
          });
      };
      fetchUpdatedProfile();
    }
  }, [stored_email]);// Dependency array: the effect runs when 'email' changes

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
   // set_win_streak(0);
    const new_player_symbol = player_symbol === 'X' ? 'O' : 'X';
    set_player_symbol(new_player_symbol);
    handle_symbol_choice(new_player_symbol)
  }

  function handle_symbol_choice(symbol) {
    set_player_symbol(symbol);
    // set_history([Array(9).fill(null)]);
    // set_current_move(0);

    // Trigger bot's turn immediately after the symbol choice
    if (symbol === 'X') {
      set_is_bot_turn(true); // Bot will make the first move
    } else {
      set_is_bot_turn(false); // Player starts if 'O' is chosen
    }
  }

  const handleGameEnd = (finalScore) => {
    // Replace with your API URL
    axios.put('http://localhost:5001/update-score', {
      email: stored_email,
      score: finalScore,
    })
      .then(response => {
        console.log('Score updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating score:', error);
      });
  };

  function check_game_result(winner) {
    // Ensure state is updated based on current values
    set_score((prevScore) => {
      let new_score = typeof prevScore === 'number' ? prevScore : 0;
      let new_streak = win_streak;

      if (winner === 'player') {
        new_score += 1;
        new_streak += 1;

        if (new_streak === 3) {
          new_score += 1; // Bonus point for 3 consecutive wins
          new_streak = 0;
        }
        set_win_streak(new_streak);
      } else if (winner === 'bot') {
        new_score -= 1;
        set_win_streak(0); // Reset win streak on loss
      }
      // Set modal and result
      set_game_result(winner === 'draw' ? 'Draw' : winner === 'player' ? 'Player Wins!' : 'Bot Wins!');
      set_is_modal_visible(true);
      // Handle game end
      console.log('new_score', new_score)
      handleGameEnd(new_score, profile.email);
      // Return the updated score
      return new_score;
    });
  }

  const handle_modal_ok = () => {
    set_is_modal_visible(false);
    handle_reset();
  };

  let status = 'player: ' + (player_symbol);

  return (
    <>
      <Row justify="center" align='middle' style={{ minHeight: '100%',margin:'3%',marginTop:'-15%' }}>
        <Col xs={24} sm={24} md={8} lg={2}></Col>
        <Col xs={24} sm={24} md={8} lg={8}><Board squares={current_squares} on_square_click={handle_click} /></Col>
        <Col xs={24} sm={24} md={8} lg={4}></Col>
        <Col xs={24} sm={24} md={8} lg={8} style={{ padding: '20px', color: '#FFF' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{status}</p>
          <p style={{ fontSize: '1rem' }}>Name: <span style={{ fontWeight: 'bold' }}>{stored_name}</span></p>
          <p style={{ fontSize: '1rem' }}>Email Address: <span style={{ fontWeight: 'bold' }}>{stored_email}</span></p>
          <p style={{ fontSize: '1.1rem' }}>Score: <span style={{ color: '#845EC2', fontWeight: 'bold' }}>{score}</span></p>
          <div style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            Win Streak: <span style={{ color: '#E92390', fontWeight: 'bold' }}>{win_streak}</span>
          </div>
          <br />
          <Button type="primary" size="large" onClick={handle_reset} style={{ backgroundColor: '#845EC2' }}>
            เปลี่ยนฝั่ง
          </Button>
        </Col>
        <Col xs={24} sm={24} md={8} lg={2}></Col>
      </Row>

      <Modal
        isOpen={is_modal_visible}
        onRequestClose={handle_modal_ok}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)', // Semi-transparent overlay
          },
          content: {
            background: 'transparent',  // Transparent background
            border: 'none',
            inset: '50% auto auto 50%',
            transform: 'translate(-50%, -50%)', // Center the modal
            maxWidth: '500px',
            textAlign: 'center',
          },
        }}
      >
        {game_result === 'Bot Wins!' ? (
          <>
            <p style={{ color: 'white', fontSize: '48px' }}>{game_result}</p>
            <img
              src="/asto_w.gif"
              alt="Bot Wins"
              style={{ width: '300px', height: '300px' }}
            />
          </>
        ) : (<>
          {game_result === 'Player Wins!' ? (
            <>
              <p style={{ color: 'white', fontSize: '48px' }}>{game_result}</p>
              <img
                src="/asto_l.gif"
                alt="Bot Wins"
                style={{ width: '300px', height: '300px' }}
              />
            </>
          ) : (
            <>
              <p style={{ color: 'white', fontSize: '48px' }}>{game_result}</p>
              <img
                src="/asto.gif"
                alt="Bot Wins"
                style={{ width: '300px', height: '300px' }}
              />
            </>
          )}</>
        )}
        <Button type="primary" onClick={handle_modal_ok} style={{ backgroundColor: '#845EC2' }}>
          OK
        </Button>
      </Modal>
    </>
  );
}

// Define lines globally
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

function find_winning_move(squares, symbol) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;