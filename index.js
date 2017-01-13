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

  var components = [],
      nodes = graph.nodes(),
      i, l;

  if (!graph.size) {
    for (i = 0, l = nodes.length; i < l; i++) {
      components.push([nodes[i]]);
    }
    return components;
  }

  var component,
      stack = [],
      node,
      neighbor,
      visited = new Set();

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

  var nodes = graph.nodes(),
      components = [],
      i, l;

  if (!graph.size) {
    for (i = 0, l = nodes.length; i < l; i++)
      components.push([nodes[i]]);
    return components;
  }

  var count = 1,
      P = [],
      S = [],
      preorder = new Map(),
      assigned = new Set(),
      component,
      pop,
      vertex;

  var DFS = function(node) {
    var neighbor,
        neighbors = graph.outNeighbors(node).concat(graph.undirectedNeighbors(node)),
        neighborOrder;

    preorder.set(node, count++);
    P.push(node);
    S.push(node);

    for (var k = 0, n = neighbors.length; k < n; k++) {
      neighbor = neighbors[k];

      if (preorder.has(neighbor)) {
        neighborOrder = preorder.get(neighbor);
        if (!assigned.has(neighbor))
          while (preorder.get(P[P.length - 1]) > neighborOrder)
            P.pop();
      }
      else
        DFS(neighbor);
    }

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

  for (i = 0, l = nodes.length; i < l; i++) {
    vertex = nodes[i];
    if (!assigned.has(vertex))
      DFS(vertex);
  }

  return components;
};
