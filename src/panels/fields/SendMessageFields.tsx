import React, { useState } from "react";
import type { Node } from "reactflow";
import type { SendMessageNodeConfig } from "../../types";

interface SendMessageFieldsProps {
  node: Node<SendMessageNodeConfig>;
  onUpdate: (nodeId: string, updates: Partial<SendMessageNodeConfig>) => void;
}

const SendMessageFields: React.FC<SendMessageFieldsProps> = ({
  node,
  onUpdate,
}) => {
  const [messageError, setMessageError] = useState("");
  const [recipientError, setRecipientError] = useState("");

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.trim() === "") {
      setMessageError("Message is required");
    } else {
      setMessageError("");
    }
    onUpdate(node.id, { message: value });
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim() === "") {
      setRecipientError("Recipient is required");
    } else {
      setRecipientError("");
    }
    onUpdate(node.id, { recipient: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          value={node.data.message}
          onChange={handleMessageChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Enter your message..."
        />
        {messageError && (
          <p className="text-red-500 text-sm mt-1">{messageError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipient
        </label>
        <input
          type="text"
          value={node.data.recipient}
          onChange={handleRecipientChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="@username or email"
        />
        {recipientError && (
          <p className="text-red-500 text-sm mt-1">{recipientError}</p>
        )}
      </div>
    </div>
  );
};

export default SendMessageFields;
