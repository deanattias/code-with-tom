import { Request, Response } from 'express';
import { fetchAllCodeBlocks, fetchCodeBlockById } from '../services/codeBlockService';

export const getCodeBlocks = async (req: Request, res: Response) => {
  try {
    const blocks = await fetchAllCodeBlocks();
    res.json(blocks);
  } catch (error: any) {  // TypeScript may require typing the error
    console.error('Error fetching code blocks:', error);
    // Provide more details in the error message, useful for debugging
    res.status(500).json({
      message: 'Error fetching code blocks',
      error: error.message || 'Unknown error', // Display specific error message if available
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined // Include stack trace in development only
    });
  }
};

export const getCodeBlockById = async (req: Request, res: Response) => {
  const blockId = parseInt(req.params.id, 10);
  try {
    const block = await fetchCodeBlockById(blockId);
    if (block) {
      res.json(block);
    } else {
      res.status(404).json({ message: 'Code block not found' });
    }
  } catch (error: any) {
    console.error('Error fetching code block:', error);
    res.status(500).json({
      message: 'Error fetching code block',
      error: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
