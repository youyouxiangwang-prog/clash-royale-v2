import React from 'react';
import type { Card } from '../../types';

interface CardHandProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
}

const CardHand: React.FC<CardHandProps> = ({ cards, onCardClick }) => {
  return (
    <div className="card-hand">
      {cards.map((card) => (
        <div 
          key={card.id} 
          className="card"
          onClick={() => onCardClick?.(card)}
        >
          <div className="card-icon">{card.type[0]}</div>
          <div className="card-cost">{card.elixirCost}</div>
        </div>
      ))}
    </div>
  );
};

export default CardHand;