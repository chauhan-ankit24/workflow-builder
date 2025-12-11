import React, { useState } from 'react';
import type { Node } from 'reactflow';
import type { ConditionNodeConfig } from '../../types';

interface ConditionFieldsProps {
  node: Node<ConditionNodeConfig>;
  onUpdate: (nodeId: string, updates: Partial<ConditionNodeConfig>) => void;
}

const ConditionFields: React.FC<ConditionFieldsProps> = ({ node, onUpdate }) => {
  const [conditionError, setConditionError] = useState('');

  const handleConditionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.trim() === '') {
      setConditionError('Condition is required');
    } else {
      setConditionError('');
    }
    onUpdate(node.id, { condition: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Condition
        </label>
        <textarea
          value={node.data.condition}
          onChange={handleConditionChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Enter condition logic..."
        />
        {conditionError && <p className="text-red-500 text-sm mt-1">{conditionError}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          True Label
        </label>
        <input
          type="text"
          value={node.data.trueLabel || ''}
          onChange={(e) => onUpdate(node.id, { trueLabel: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="True path label"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          False Label
        </label>
        <input
          type="text"
          value={node.data.falseLabel || ''}
          onChange={(e) => onUpdate(node.id, { falseLabel: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="False path label"
        />
      </div>
    </div>
  );
};

export default ConditionFields;
