import React from 'react';

export interface FlowNode {
  id: string;
  label: string;
}

export interface FlowLink {
  source: string;
  target: string;
  value: number;
}

export interface SmartMoneyFlowProps {
  nodes: FlowNode[];
  links: FlowLink[];
  width?: number;
  height?: number;
}

export const SmartMoneyFlow: React.FC<SmartMoneyFlowProps> = ({ nodes, links, width = 800, height = 500 }) => {
  return <div style={{ width, height }} data-component="SmartMoneyFlow" />;
};
