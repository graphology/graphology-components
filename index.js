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
    return graph.nodes().map(function(node) {
      return [node];
    });

  var seen = new Set();
  var components = [];
  var stack = [];
  var component;

  var nodes = graph.nodes();

  var i, l, node, n1;

  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];

    if (seen.has(node))
      continue;

    component = [];
    stack.push(node);

    while (stack.length !== 0) {
      n1 = stack.pop();

      if (seen.has(n1))
        continue;

      seen.add(n1);
      component.push(n1);

      graph.forEachNeighbor(n1, function(n2) {
        stack.push(n2);
      });
    }

    components.push(component);
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
