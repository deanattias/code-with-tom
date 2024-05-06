import express from 'express';
import { getCodeBlocks, getCodeBlockById } from '../controllers/codeBlockController';

const router = express.Router();

router.get('/', getCodeBlocks);
router.get('/:id', getCodeBlockById);

export default router;
