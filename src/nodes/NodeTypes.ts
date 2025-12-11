export const NodeType = {
  START: 'start',
  CONDITION: 'condition',
  SEND_MESSAGE: 'sendMessage',
  FOLLOW_USER: 'followUser',
  WAIT_TIMER: 'waitTimer',
} as const;

export const NODE_TYPES = {
  [NodeType.START]: 'Start',
  [NodeType.CONDITION]: 'Condition',
  [NodeType.SEND_MESSAGE]: 'Send Message',
  [NodeType.FOLLOW_USER]: 'Follow User',
  [NodeType.WAIT_TIMER]: 'Wait Timer',
} as const;

export type NodeTypeKey = keyof typeof NODE_TYPES;
