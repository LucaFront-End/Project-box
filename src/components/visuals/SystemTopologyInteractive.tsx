import React from 'react';
import { motion } from 'framer-motion';
import { TopologyNode } from '../../data/details';

interface SystemTopologyInteractiveProps {
  nodes: TopologyNode[];
  edges: [string, string][];
  activeNodeId: string;
  onSelectNode: (node: TopologyNode) => void;
}

export const SystemTopologyInteractive: React.FC<
  SystemTopologyInteractiveProps
> = ({ nodes, edges, activeNodeId, onSelectNode }) => {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const activeNode = nodeMap.get(activeNodeId) ?? nodes[0];

  return (
    <div className="rounded-[28px] bg-[#0F0F12] border border-white/10 p-6 sm:p-8 flex flex-col justify-between gap-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
          TOPOLOGÍA DE INTERCONEXIÓN · CLIC PARA INSPECCIONAR
        </span>
        <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
      </div>

      {/* Interactive Vector Topology */}
      <svg viewBox="0 0 460 270" className="w-full h-[220px] sm:h-[250px]" fill="none">
        {/* Subtle Architectural Grid Backdrop */}
        <circle
          cx="230"
          cy="135"
          r="110"
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="4 6"
        />

        {/* Animated Signal Edges */}
        {edges.map(([fromId, toId], idx) => {
          const from = nodeMap.get(fromId);
          const to = nodeMap.get(toId);
          if (!from || !to) return null;
          const isLinkedActive =
            fromId === activeNodeId || toId === activeNodeId;

          return (
            <g key={`${fromId}-${toId}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isLinkedActive ? '#EA6B1A' : 'rgba(255,255,255,0.22)'}
                strokeWidth={isLinkedActive ? 2 : 1.3}
              />
              <motion.circle
                r="3.2"
                fill="#FF8E42"
                animate={{
                  cx: [from.x, to.x],
                  cy: [from.y, to.y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  delay: idx * 0.45,
                  ease: 'easeInOut',
                }}
              />
            </g>
          );
        })}

        {/* Interactive Hardware Nodes */}
        {nodes.map((node) => {
          const isActive = node.id === activeNodeId;
          return (
            <g
              key={node.id}
              onClick={() => onSelectNode(node)}
              onMouseEnter={() => onSelectNode(node)}
              className="cursor-pointer"
            >
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="38"
                  fill="rgba(234,107,26,0.16)"
                />
              )}
              <rect
                x={node.x - 44}
                y={node.y - 22}
                width="88"
                height="44"
                rx="12"
                fill={isActive ? '#EA6B1A' : '#18181D'}
                stroke={isActive ? '#FF9E5E' : 'rgba(255,255,255,0.24)'}
                strokeWidth={isActive ? 1.8 : 1.1}
              />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="600"
                fontFamily="JetBrains Mono, monospace"
              >
                {node.code}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Active Node Specification Strip */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="space-y-0.5 min-w-0">
          <p className="font-mono text-[10px] text-signal uppercase tracking-wider">
            {activeNode.code} · NODO ACTIVO
          </p>
          <p className="text-sm font-semibold text-white truncate">
            {activeNode.title}
          </p>
          <p className="text-xs text-silver truncate">{activeNode.role}</p>
        </div>
      </div>
    </div>
  );
};
