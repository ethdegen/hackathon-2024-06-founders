import { NextApiRequest, NextApiResponse } from 'next';
import { openaiClientPromise } from '../../src/utils/openaiClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  try {
    const openai = await openaiClientPromise;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: '1024x1024',
    });

    const imageUrl = response.data[0].url;

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ message: 'Error generating image' });
  }
}
