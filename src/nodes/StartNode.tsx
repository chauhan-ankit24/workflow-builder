import React from "react";
import { Handle, Position } from "reactflow";
import type { StartNodeConfig } from "../types";

interface StartNodeProps {
  data: StartNodeConfig;
}

const StartNode: React.FC<StartNodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-green-500 border-2 border-stone-400 relative group">
      <div className="flex items-center">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-white">
          <svg
            className="w-6 h-6 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="mx-2 flex-1">
          <div className="text-lg font-bold text-white">{data.label}</div>
        </div>
        <div className="flex space-x-1 relative z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(data.id);
            }}
            className="p-1 rounded bg-white/20 hover:bg-white/30 text-white relative z-10"
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
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

export default StartNode;
