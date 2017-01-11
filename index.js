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
function connectedComponents(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-components: the given graph is not a valid graphology instance.');

  if (!graph.order)
    return [];

  if (!graph.size)
    return graph.nodes().map(function(node) { return [node]; });

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
}

module.exports = connectedComponents;
