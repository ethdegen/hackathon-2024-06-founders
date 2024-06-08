// src/components/Card.tsx
import React from 'react';

interface CardProps {
  text: string;
  onClick?: () => void;
  isSelected?: boolean;
  type: 'prompt' | 'joke';
}

const Card: React.FC<CardProps> = ({ text, onClick, isSelected, type }) => {
  const cardStyles = type === 'prompt' ? 'card prompt' : 'card joke';
  const selectedStyles = isSelected ? 'border-2 border-blue-500 bg-blue-100' : '';

  return (
    <div
      className={`${cardStyles} ${selectedStyles}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Card;
