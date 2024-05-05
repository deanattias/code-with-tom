import React from 'react';

interface CodeBlockItemProps {
  title: string;
}

const CodeBlockItem: React.FC<CodeBlockItemProps> = ({ title }) => {
  return <span>{title}</span>;
};

export default CodeBlockItem;
