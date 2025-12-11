import React, { useState } from 'react';
import type { Node } from 'reactflow';
import type { WaitTimerNodeConfig } from '../../types';

interface WaitTimerFieldsProps {
  node: Node<WaitTimerNodeConfig>;
  onUpdate: (nodeId: string, updates: Partial<WaitTimerNodeConfig>) => void;
}

const WaitTimerFields: React.FC<WaitTimerFieldsProps> = ({ node, onUpdate }) => {
  const [hoursError, setHoursError] = useState('');
  const [minutesError, setMinutesError] = useState('');

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    if (value < 0) {
      setHoursError('Hours must be non-negative');
    } else {
      setHoursError('');
    }
    onUpdate(node.id, { hours: value });
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    if (value < 0) {
      setMinutesError('Minutes must be non-negative');
    } else {
      setMinutesError('');
    }
    onUpdate(node.id, { minutes: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hours
        </label>
        <input
          type="number"
          min="0"
          value={node.data.hours}
          onChange={handleHoursChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
        {hoursError && <p className="text-red-500 text-sm mt-1">{hoursError}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Minutes
        </label>
        <input
          type="number"
          min="0"
          value={node.data.minutes}
          onChange={handleMinutesChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
        {minutesError && <p className="text-red-500 text-sm mt-1">{minutesError}</p>}
      </div>
    </div>
  );
};

export default WaitTimerFields;
