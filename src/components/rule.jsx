import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

const Rule = () => {
    const [narrativeStep, setNarrativeStep] = useState(1);
    const [ticVisible, setTicVisible] = useState(false);
    const [tacVisible, setTacVisible] = useState(false);
    const [doomVisible, setDoomVisible] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("#fff");
    const [gameConfigVisible, setGameConfigVisible] = useState(false);
    const [rulesVisible, setRulesVisible] = useState(false);
    const [displayText, setDisplayText] = useState(""); // State to hold progressively revealed text
    const [fullText, setFullText] = useState(""); // Full text to be revealed character by character
    const [charIndex, setCharIndex] = useState(0); // Index of current character being displayed
  
    const transitionPeriod = 50;
  
    // UseEffect to control the typewriter effect
    useEffect(() => {
      if (charIndex < fullText.length) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => prev + fullText[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 50); // Adjust the speed here (50ms per character)
        return () => clearTimeout(timeout);
      }
    }, [charIndex, fullText]);
  
    // Trigger typewriter effect when narrativeStep changes
    useEffect(() => {
      if (narrativeStep === 1) {
        setFullText("Hi! "+ localStorage.getItem('name')+" My name is giphy. You can ask me any questions you have.");
        setDisplayText("");
        setCharIndex(0);
      } else if (narrativeStep === 2) {
        setFullText(`The game is played on a 3x3 grid.\n
        Two players take turns marking the spaces in the grid, one with "X" and the other with "O"\n
        The first player to get three of their marks in a row (horizontally, vertically, or diagonally) wins.\n
        If all nine spaces are filled without a winner, the game is considered a draw.\n
        The game encourages strategic thinking and planning ahead to block the opponent's moves.
        `);
        setDisplayText("");
        setCharIndex(0);
      } else if (narrativeStep === 3) {
        setFullText(`When a player defeats a bot, they will receive 1 point (if they lose, they will lose 1 point).\n
        If the player defeats the bot 3 times in a row, he or she will receive 1 extra point and win streak will be recount`);
        setDisplayText("");
        setCharIndex(0);
      }
    }, [narrativeStep]);
  
    return (
      <div style={{ backgroundColor:  'rgba(0, 0, 0, 0.5)',color:'#FFF'}}>
        {narrativeStep === 1 && (
          <div className="game-narrative">
            <p className="game-narrative-text">{displayText}</p>
            {charIndex === fullText.length && <Button className="game-btn" onClick={() => setNarrativeStep(2)}>Rules of the OX Game?</Button>}&nbsp;
            {charIndex === fullText.length && <Button className="game-btn" onClick={() => setNarrativeStep(3)}>How're score calculate?</Button>}
          </div>
        )}
  
        {narrativeStep === 2 && (
          <div className="game-narrative">
            <p className="game-narrative-text">{displayText}</p>
            {charIndex === fullText.length && <Button className="game-btn" onClick={() => setNarrativeStep(2)}>Rules of the OX Game?</Button>}&nbsp;
            {charIndex === fullText.length && <Button className="game-btn" onClick={() => setNarrativeStep(3)}>How're score calculate?</Button>}
          </div>
        )}
  
        {narrativeStep === 3 && (
          <div className="game-narrative">
            <p className="game-narrative-text">{displayText}</p>
            {charIndex === fullText.length && <Button className="game-btn" onClick={() => setNarrativeStep(2)}>Rules of the OX Game?</Button>}&nbsp;
            {charIndex === fullText.length && <Button className="game-btn" onClick={() => setNarrativeStep(3)}>How're score calculate?</Button>}
          </div>
        )}
      </div>
    );
  };

export default Rule;
