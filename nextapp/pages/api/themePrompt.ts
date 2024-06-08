import { NextApiRequest, NextApiResponse } from "next";
import { openaiClientPromise } from "../../src/utils/openaiClient";

openaiClientPromise.then((openai) => console.log("OpenAI client imported:"));
let openai;
async function init() {
    try {
        console.log("init starting");
        openai = await openaiClientPromise;
        console.log("init completed?");
    } catch (error) {
        console.error("Error initializing OpenAI client:", error);
    }
}

await init();

function extractQuestions(content: string): string[] {
    const questionPattern = /"([^"]*?)"/g;
    let match;
    const questions = [];
    while ((match = questionPattern.exec(content)) !== null) {
        questions.push(match[1]);
        return questions;
    }
}

async function generateFIBCard(description: string): Promise<string[]> {
    if (!openai) {
        throw new Error("OpenAI client is not initialized.");
    }

    try {
        const questions = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "user",
                    content: `Given the following theme, for our Cards Against Humanity game, give us 4 Black fill in the blank cards that are creative, original, dark humor funny. Your output should be given as a JSON array of strings. Theme: ${description}`,
                },
            ],
            max_tokens: 1024, // Reduced token limit
        });

        const content = questions.choices[0].message.content.trim();
        console.log("Raw questions content:", content);

        const result = [];
        // Attempt to parse JSON
        try {
            const parsed = JSON.parse(content);
            result.push(parsed[0]);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            console.log("Attempting to extract questions from raw content...");
            result.push(extractQuestions(content));
        }

        // get answers
        try {
            const answers = await fetch("http://localhost:8000/cah/invoke", {
                method: "POST",
                body: JSON.stringify({
                    input: {
                        theme: description,
                        black: result[0],
                        white: "office perks",
                    },
                }),
            });

            const json = await answers.json();
            console.log("Raw a answers content:", json);
            const output = json["output"];
            const cards = JSON.parse(output);
            for (const card of cards) {
                result.push(card);
            }
        } catch (e) {
            result.push("answer 1");
            result.push("answer 2");
            result.push("answer 3");
            result.push("answer 4");
        }

        return result;
    } catch (error) {
        console.error("Error generating card:", error);
        throw error; // Rethrow the error for handling upstream
    }
}

init().catch(console.error);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    const { theme } = req.body;

    if (!theme) {
        res.status(400).json({ message: "Theme is required" });
        return;
    }

    try {
        const prompt = await generateFIBCard(theme);
        res.status(200).json({ prompt });
    } catch (error) {
        console.error("Error generating prompt:", error);
        res.status(500).json({ message: "Error generating prompt", error: error.message });
    }
}
