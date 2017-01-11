/**
 * Graphology Components
 * ======================
 *
 * Basic connected components-related functions.
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Function returning a list of connected components.
 *
 * @param  {Graph} graph - Target graph.
 * @return {array}
 */
exports.connectedComponents = function(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-components: the given graph is not a valid graphology instance.');

  if (!graph.order)
    return [];

  if (!graph.size)
    return graph.nodes();

  var components = [],
      component,
      stack = [],
      nodes = graph.nodes(),
      node,
      neighbor,
      visited = new Set(),
      i,
      l;

  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];

    if (!visited.has(node)) {
      visited.add(node);
      component = [node];
      components.push(component);

      stack.push.apply(stack, graph.neighbors(node));

      while (stack.length) {
        neighbor = stack.pop();

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          component.push(neighbor);
          stack.push.apply(stack, graph.neighbors(neighbor));
        }
      }
    }
  }

  return components;
};

/**
 * Function returning a list of strongly connected components.
 *
 * @param  {Graph} graph - Target directed graph.
 * @return {array}
 */
exports.stronglyConnectedComponents = function(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-components: the given graph is not a valid graphology instance.');

  if (!graph.order)
    return [];

  if (graph.type === 'undirected')
    throw new Error('graphology-components: the given graph is undirected');

  var nodes = graph.nodes();

  if (!graph.size)
    return nodes.map(function(node) {
      return [node];
    });

  var count = 1,
    P = [],
    S = [],
    preorder = new Map(),
    assigned = new Set(),
    components = [],
    component,
    pop,
    neighbOrder;

  var DFS = function(node) {
    preorder.set(node, count++);
    P.push(node);
    S.push(node);

    graph.outboundNeighbors(node).forEach(function(neighbor) {
      if (preorder.has(neighbor)) {
        neighbOrder = preorder.get(neighbor);
        if (!assigned.has(neighbor))
          while (preorder.get(P[P.length - 1]) > neighbOrder)
            P.pop();
      }
      else
        DFS(neighbor);
    });

    if (preorder.get(P[P.length - 1]) === preorder.get(node)) {
      component = [];
      do {
        pop = S.pop();
        component.push(pop);
        assigned.add(pop);
      } while (pop !== node);
      components.push(component);
      P.pop();
    }
  };

  nodes.forEach(function(node) {
    if (!assigned.has(node)) {
      DFS(node);
    }
  });
  return components;
};
