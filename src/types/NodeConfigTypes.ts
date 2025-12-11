export interface BaseNodeConfig {
  id: string;
  type: string;
  label: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface StartNodeConfig extends BaseNodeConfig {
  type: 'start';
}

export interface ConditionNodeConfig extends BaseNodeConfig {
  type: 'condition';
  condition: string;
  trueLabel?: string;
  falseLabel?: string;
}

export interface SendMessageNodeConfig extends BaseNodeConfig {
  type: 'sendMessage';
  message: string;
  recipient: string;
}

export interface FollowUserNodeConfig extends BaseNodeConfig {
  type: 'followUser';
  username: string;
}

export interface WaitTimerNodeConfig extends BaseNodeConfig {
  type: 'waitTimer';
  hours: number;
  minutes: number;
}

export type NodeConfig =
  | StartNodeConfig
  | ConditionNodeConfig
  | SendMessageNodeConfig
  | FollowUserNodeConfig
  | WaitTimerNodeConfig;
