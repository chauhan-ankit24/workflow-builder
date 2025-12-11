export const detectCycles = (edges: { source: string; target: string }[]): boolean => {
  const graph = new Map<string, string[]>();
  const visited = new Set<string>();
  const recStack = new Set<string>();

  // Build adjacency list
  edges.forEach(edge => {
    if (!graph.has(edge.source)) {
      graph.set(edge.source, []);
    }
    graph.get(edge.source)!.push(edge.target);
  });

  const hasCycleDFS = (node: string): boolean => {
    if (recStack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (hasCycleDFS(neighbor)) return true;
    }

    recStack.delete(node);
    return false;
  };

  for (const node of graph.keys()) {
    if (hasCycleDFS(node)) return true;
  }

  return false;
};

export const findDisconnectedNodes = (
  nodes: { id: string }[],
  edges: { source: string; target: string }[]
): string[] => {
  const connectedNodes = new Set<string>();

  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  return nodes
    .filter(node => !connectedNodes.has(node.id))
    .map(node => node.id);
};

export const topologicalSort = (edges: { source: string; target: string }[]): string[] => {
  const graph = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  const allNodes = new Set<string>();

  // Build graph and in-degree map
  edges.forEach(edge => {
    allNodes.add(edge.source);
    allNodes.add(edge.target);

    if (!graph.has(edge.source)) {
      graph.set(edge.source, []);
    }
    graph.get(edge.source)!.push(edge.target);

    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    if (!inDegree.has(edge.source)) {
      inDegree.set(edge.source, 0);
    }
  });

  // Initialize queue with nodes having in-degree 0
  const queue: string[] = [];
  allNodes.forEach(node => {
    if ((inDegree.get(node) || 0) === 0) {
      queue.push(node);
    }
  });

  const result: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    const neighbors = graph.get(node) || [];
    neighbors.forEach(neighbor => {
      const newInDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newInDegree);
      if (newInDegree === 0) {
        queue.push(neighbor);
      }
    });
  }

  // If result doesn't include all nodes, there's a cycle
  return result.length === allNodes.size ? result : [];
};
