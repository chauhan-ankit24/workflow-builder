import React, { useState } from 'react';
import type { Node } from 'reactflow';
import type { FollowUserNodeConfig } from '../../types';

interface FollowUserFieldsProps {
  node: Node<FollowUserNodeConfig>;
  onUpdate: (nodeId: string, updates: Partial<FollowUserNodeConfig>) => void;
}

const FollowUserFields: React.FC<FollowUserFieldsProps> = ({ node, onUpdate }) => {
  const [usernameError, setUsernameError] = useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim() === '') {
      setUsernameError('Username is required');
    } else {
      setUsernameError('');
    }
    onUpdate(node.id, { username: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          value={node.data.username}
          onChange={handleUsernameChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="@username"
        />
        {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
      </div>
    </div>
  );
};

export default FollowUserFields;
