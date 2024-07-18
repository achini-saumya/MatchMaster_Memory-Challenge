import React, { useState, useEffect } from 'react';
import './App.css';

const Card = ({ id, value, isFlipped, onClick }) => (
  <button className={`card ${isFlipped ? 'flipped' : ''}`} onClick={() => onClick(id)}>
    {isFlipped ? value : ''}
  </button>
);

const App = () => {
  const [cards, setCards] = useState(shuffle(createCards()));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [disableAll, setDisableAll] = useState(false);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (flipped.length === 2) {
      setDisableAll(true);
      const [first, second] = flipped;
      if (cards[first].value === cards[second].value) {
        setMatched([...matched, cards[first].value]);
        resetFlip();
      } else {
        setTimeout(resetFlip, 1000);
      }
      setMoves((prevMoves) => prevMoves + 1);
    }
  }, [flipped]);

  const resetFlip = () => {
    setFlipped([]);
    setDisableAll(false);
  };

  const handleClick = (id) => {
    if (!isPlaying) setIsPlaying(true);
    if (disableAll || flipped.includes(id) || matched.includes(cards[id].value)) return;
    setFlipped([...flipped, id]);
  };

  const isFlipped = (id) => flipped.includes(id) || matched.includes(cards[id].value);

  const resetGame = () => {
    setCards(shuffle(createCards()));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setIsPlaying(false);
  };

  return (
    <div className="game">
      <h3 className='h1'>MatchMaster: Memory Challenge</h3>
      <div className="header">
        <div className="moves"> Moves: {moves}</div>
        <div className="timer">Time: {time}s</div>
        <button className="reset-button" onClick={resetGame}>Reset</button>
      </div>
      <div className="board">
        {cards.map((card, index) => (
          <Card
            key={index}
            id={index}
            value={card.value}
            isFlipped={isFlipped(index)}
            onClick={handleClick}
          />
        ))}
      </div>
      {matched.length === cards.length / 2 && (
        <div className="win-message">You Win! Moves: {moves}, Time: {time}s</div>
      )}
    </div>
  );
};

const createCards = () => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cards = values.concat(values).map((value, id) => ({ id, value }));
  return cards;
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default App;
