import React, { useState, useEffect } from 'react';
import { Button, Image } from 'antd';

const Rule = () => {
    const [narrativeStep, setNarrativeStep] = useState(1);
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
            setFullText("Hi! " + localStorage.getItem('name') + " My name is giphy. You can ask me any questions you have.");
            setDisplayText("");
            setCharIndex(0);
        } else if (narrativeStep === 2) {
            setFullText(`The game is played on a 3x3 grid.\n
        Two players take turns marking the spaces in the grid, one with "X" and the other with "O"\n
        The first player to get three of their marks in a row wins.\n
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
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#FFF',width:'500px',height:'650px' }}>
            {narrativeStep === 1 && (
                <>
                    <div className="game-narrative" style={{position:'relative',zIndex:'99'}}>
                        <p className="game-narrative-text">{displayText}</p>
                        {charIndex === fullText.length && <Button className="game-btn" onClick={() => setNarrativeStep(2)}>Rules of the OX Game?</Button>}&nbsp;
                        {charIndex === fullText.length && <Button className="game-btn" onClick={() => setNarrativeStep(3)}>How're score calculate?</Button>}
                    </div>
                    <br/>
                 <img src='/giphy.webp' preview={false} style={{ width:'500px',position: 'absolute',zIndex:'10',top:170,right:0}} />
                </>
            )}

            {narrativeStep === 2 && (
                <>
                    <div className="game-narrative" style={{position:'relative',zIndex:'99'}}>
                        <p className="game-narrative-text">{displayText}</p>
                        {charIndex === fullText.length && <Button className="game-btn" onClick={() => setNarrativeStep(2)}>Rules of the OX Game?</Button>}&nbsp;
                        {charIndex === fullText.length && <Button className="game-btn" onClick={() => setNarrativeStep(3)}>How're score calculate?</Button>}
                    </div>
                    <img src='/giphy.webp' preview={false} style={{ width:'500px',position: 'absolute',zIndex:'10',top:170,right:0}} />
                </>
            )}

            {narrativeStep === 3 && (
                <>
                    <div className="game-narrative" style={{position:'relative',zIndex:'99'}}>
                        <p className="game-narrative-text">{displayText}</p>
                        {charIndex === fullText.length && <Button className="game-btn" onClick={() => setNarrativeStep(2)}>Rules of the OX Game?</Button>}&nbsp;
                        {charIndex === fullText.length && <Button className="game-btn" onClick={() => setNarrativeStep(3)}>How're score calculate?</Button>}
                    </div>
                    <img src='/giphy.webp' preview={false} style={{ width:'500px',position: 'absolute',zIndex:'10',top:170,right:0}} />
                </>
            )}
        </div>
    );
};

export default Rule;
