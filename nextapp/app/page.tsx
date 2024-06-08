"use client";

// pages/index.tsx
import React, { useEffect, useState } from "react";
import GameBoard from "../src/components/GameBoard";
import ThemeInput from "../src/components/ThemeInput";

const Home: React.FC = () => {
    const [theme, setTheme] = useState("");
    const [prompt, setPrompt] = useState("");
    const [jokes, setJokes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false); // Add loading state

    const handleThemeSubmit = async (newTheme: string) => {
        if (newTheme !== theme) {
            setTheme(newTheme + " against humanity");
        }
        await fetchNewCards(newTheme);
    };

    const fetchNewCards = async (theme: string) => {
        setLoading(true); // Set loading to true
        console.log("Fetching new cards for theme:", theme);
        try {
            const response = await fetch("/api/themePrompt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ theme }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error fetching prompt:", errorText);
                throw new Error("Error fetching prompt");
            }

            const data = await response.json();
            const generatedData = data.prompt; // The response should be a valid JSON already
            setPrompt(generatedData[0]); // Set the first element as the prompt
            setJokes(generatedData.slice(1)); // Set the rest as jokes
        } catch (error) {
            console.error("Error:", error);
        }
        setLoading(false); // Set loading to false
    };

    const handleConfirm = () => {
        fetchNewCards(theme);
    };

    useEffect(() => {
        if (theme) {
            fetchNewCards(theme);
        }
    }, [theme]);

    return (
        <main className="flex flex-col items-center justify-between h-full w-full p-6">
            <div className="form-container">
                <ThemeInput onThemeSubmit={handleThemeSubmit} loading={loading} />
            </div>
            <GameBoard
                prompt={prompt}
                jokes={jokes}
                onConfirm={handleConfirm}
                loading={loading}
                setLoading={setLoading}
            />
        </main>
    );
};

export default Home;
