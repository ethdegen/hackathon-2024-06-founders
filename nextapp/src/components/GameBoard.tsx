"use client";

// src/components/GameBoard.tsx
import React, { useState } from 'react';
import Card from './Card';

interface GameBoardProps {
  prompt: string;
  jokes: string[];
  onConfirm: () => void;
  loading: boolean; // Add loading prop
  setLoading: (loading: boolean) => void; // Add setLoading prop
}

const GameBoard: React.FC<GameBoardProps> = ({ prompt, jokes, onConfirm, loading, setLoading }) => {
  const [selectedJoke, setSelectedJoke] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [mergedPrompt, setMergedPrompt] = useState<string | null>(null);

  const defaultJokes = ['A', 'B', 'C', 'D'];
  const displayJokes = jokes.length > 0 ? jokes : defaultJokes;

  const handleJokeClick = (joke: string) => {
    if (!loading) {
      console.log('Joke selected:', joke);
      setSelectedJoke(joke);
    }
  };

  const handleConfirmClick = async () => {
    console.log('Confirm button clicked');
    if (selectedJoke && !loading) {
      const mergedText = prompt.replace(/__________|_____+/g, selectedJoke);
      setMergedPrompt(mergedText);
      console.log('Merged Text:', mergedText);

      try {
        setLoading(true); // Set loading to true
        const response = await fetch('/api/generateImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: mergedText }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error fetching image:', errorText);
          throw new Error('Error fetching image');
        }

        const data = await response.json();
        setImageUrl(data.imageUrl);
      } catch (error) {
        console.error('Error:', error);
      }
      setLoading(false); // Set loading to false

      onConfirm();
      setSelectedJoke(null); // Reset selected joke after confirming
    }
  };

  console.log('GameBoard component rendered');

  return (
    <div className="game-board flex flex-col items-center justify-between h-full w-full">
      <div className="flex justify-center mb-4">
        <Card text={prompt} type="prompt" onClick={() => {}} isSelected={false} />
      </div>
      <div className="card-container">
        {displayJokes.map((joke, index) => (
          <Card
            key={index}
            text={joke}
            onClick={() => handleJokeClick(joke)}
            isSelected={selectedJoke === joke}
            type="joke"
            disabled={loading} // Disable card when loading
          />
        ))}
      </div>
      <button
        onClick={handleConfirmClick}
        className={`mt-4 submit-button ${loading ? 'loading' : ''}`}
        disabled={!selectedJoke || loading} // Disable button when no joke is selected or loading
      >
        Confirm
      </button>
      {imageUrl && mergedPrompt && (
        <div className="image-container">
          <img src={imageUrl} alt="Generated" />
          <p className="merged-prompt">{mergedPrompt}</p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
