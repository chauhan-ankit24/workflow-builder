import React from "react";
import { Handle, Position } from "reactflow";
import type { ConditionNodeConfig } from "../types";

interface ConditionNodeProps {
  data: ConditionNodeConfig;
}

const ConditionNode: React.FC<ConditionNodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-yellow-500 border-2 border-stone-400 relative group">
      <div className="flex items-center">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-white">
          <svg
            className="w-6 h-6 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="mx-2 flex-1">
          <div className="text-lg font-bold text-white">{data.label}</div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(data.id);
            }}
            className="p-1 rounded bg-white/20 hover:bg-white/30 text-white"
            title="Delete"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-yellow-500"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3 bg-yellow-500"
      />
    </div>
  );
};

export default ConditionNode;
