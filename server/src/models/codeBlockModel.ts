export interface CodeBlock {
  id: number;
  title: string;
  content: string;
}

export const selectCodeBlocks = 'SELECT id, title FROM code_blocks';
export const selectCodeBlockById = 'SELECT * FROM code_blocks WHERE id = $1';
