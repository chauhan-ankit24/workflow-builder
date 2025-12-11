import { validateConnections } from './workflow/validation/validateConnections';
import type { Node, Edge } from 'reactflow';

// Test cases for validateConnections
const testCases = [
  {
    name: 'Valid linear workflow',
    nodes: [
      { id: 'start', type: 'start', position: { x: 0, y: 0 }, data: {} },
      { id: 'node1', type: 'sendMessage', position: { x: 100, y: 0 }, data: {} },
      { id: 'node2', type: 'waitTimer', position: { x: 200, y: 0 }, data: {} },
    ] as Node[],
    edges: [
      { id: 'e1', source: 'start', target: 'node1' },
      { id: 'e2', source: 'node1', target: 'node2' },
    ] as Edge[],
    expectedErrors: 0,
  },
  {
    name: 'Start node with incoming connection',
    nodes: [
      { id: 'start', type: 'start', position: { x: 0, y: 0 }, data: {} },
      { id: 'node1', type: 'sendMessage', position: { x: 100, y: 0 }, data: {} },
    ] as Node[],
    edges: [
      { id: 'e1', source: 'node1', target: 'start' },
    ] as Edge[],
    expectedErrors: 2, // START_INCOMING_CONNECTION and START_OUTGOING_COUNT
  },
  {
    name: 'Node with multiple incoming connections',
    nodes: [
      { id: 'start', type: 'start', position: { x: 0, y: 0 }, data: {} },
      { id: 'node1', type: 'sendMessage', position: { x: 100, y: 0 }, data: {} },
      { id: 'node2', type: 'waitTimer', position: { x: 200, y: 0 }, data: {} },
    ] as Node[],
    edges: [
      { id: 'e1', source: 'start', target: 'node1' },
      { id: 'e2', source: 'start', target: 'node2' },
    ] as Edge[],
    expectedErrors: 2, // INVALID_INCOMING_COUNT for node1 and node2
  },
  {
    name: 'Node with multiple outgoing connections',
    nodes: [
      { id: 'start', type: 'start', position: { x: 0, y: 0 }, data: {} },
      { id: 'node1', type: 'sendMessage', position: { x: 100, y: 0 }, data: {} },
      { id: 'node2', type: 'waitTimer', position: { x: 200, y: 0 }, data: {} },
      { id: 'node3', type: 'condition', position: { x: 300, y: 0 }, data: {} },
    ] as Node[],
    edges: [
      { id: 'e1', source: 'start', target: 'node1' },
      { id: 'e2', source: 'node1', target: 'node2' },
      { id: 'e3', source: 'node1', target: 'node3' },
    ] as Edge[],
    expectedErrors: 1, // MULTIPLE_OUTGOING for node1
  },
  {
    name: 'Workflow with cycle',
    nodes: [
      { id: 'start', type: 'start', position: { x: 0, y: 0 }, data: {} },
      { id: 'node1', type: 'sendMessage', position: { x: 100, y: 0 }, data: {} },
    ] as Node[],
    edges: [
      { id: 'e1', source: 'start', target: 'node1' },
      { id: 'e2', source: 'node1', target: 'start' },
    ] as Edge[],
    expectedErrors: 3, // CYCLE_DETECTED, START_INCOMING_CONNECTION, START_OUTGOING_COUNT
  },
  {
    name: 'Workflow with isolated node',
    nodes: [
      { id: 'start', type: 'start', position: { x: 0, y: 0 }, data: {} },
      { id: 'node1', type: 'sendMessage', position: { x: 100, y: 0 }, data: {} },
      { id: 'isolated', type: 'waitTimer', position: { x: 200, y: 0 }, data: {} },
    ] as Node[],
    edges: [
      { id: 'e1', source: 'start', target: 'node1' },
    ] as Edge[],
    expectedErrors: 1, // ISOLATED_NODES
  },
  {
    name: 'Multiple start nodes',
    nodes: [
      { id: 'start1', type: 'start', position: { x: 0, y: 0 }, data: {} },
      { id: 'start2', type: 'start', position: { x: 50, y: 0 }, data: {} },
    ] as Node[],
    edges: [] as Edge[],
    expectedErrors: 1, // MULTIPLE_START_NODES
  },
];

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  const validations = validateConnections(testCase.nodes, testCase.edges);
  const errorCount = validations.filter(v => !v.isValid).length;
  console.log(`Expected errors: ${testCase.expectedErrors}, Actual errors: ${errorCount}`);
  if (errorCount !== testCase.expectedErrors) {
    console.log('FAIL: Unexpected error count');
    validations.forEach(v => {
      if (!v.isValid) {
        console.log(`- ${v.error} (${v.code})`);
      }
    });
  } else {
    console.log('PASS');
  }
  console.log('---');
});
