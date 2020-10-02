/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert'),
    Graph = require('graphology'),
    lib = require('./');

var connectedComponents = lib.connectedComponents,
    largestConnectedComponent = lib.largestConnectedComponent,
    stronglyConnectedComponents = lib.stronglyConnectedComponents;

var sortComponents = function(components) {
  components.forEach(function(c) {
    c.sort(function(a, b) {
      return a - b;
    });
  });
  components.sort(function(a, b) {
    return a[0] - b[0];
  });
};

function addNodesFrom(graph, nodes) {
  nodes.forEach(function(node) {
    graph.addNode(node);
  });
}

describe('graphology-components', function() {

  describe('#.connectedComponents', function() {

    it('should throw if given an invalid graph.', function() {
      assert.throws(function() {
        connectedComponents(null);
      }, /graphology/);
    });

    it('should handle empty graphs.', function() {
      var graph = new Graph();

      assert.deepStrictEqual(connectedComponents(graph), []);
    });

    it('should handle graphs without edges.', function() {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);

      assert.deepStrictEqual(connectedComponents(graph), [['1'], ['2'], ['3']]);
    });

    it('should return the correct components.', function() {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3, 4, 5, 6, 7]);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);
      graph.addEdge(3, 4);
      graph.addEdge(2, 4);

      graph.addEdge(5, 6);

      var components = connectedComponents(graph);
      assert.deepStrictEqual(components, [['1', '2', '4', '3'], ['5', '6'], ['7']]);
    });

    it('should also work with self loops.', function() {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);
      graph.addEdge(1, 2);
      graph.addEdge(1, 1);

      var components = connectedComponents(graph);

      assert.deepStrictEqual(components, [['1', '2'], ['3']]);
    });
  });

  describe('#.largestConnectedComponent', function() {
    it('should throw if given an invalid graph.', function() {
      assert.throws(function() {
        largestConnectedComponent(null);
      }, /graphology/);
    });

    it('should handle empty graphs.', function() {
      var graph = new Graph();

      assert.deepStrictEqual(largestConnectedComponent(graph), []);
    });

    it('should handle graphs without edges.', function() {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);

      assert.deepStrictEqual(largestConnectedComponent(graph), ['1']);
    });

    it('should return the correct components.', function() {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3, 4, 5, 6, 7]);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);
      graph.addEdge(3, 4);
      graph.addEdge(2, 4);

      graph.addEdge(5, 6);

      var component = largestConnectedComponent(graph);
      assert.deepStrictEqual(component, ['1', '2', '4', '3']);
    });

    it('should also work with self loops.', function() {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);
      graph.addEdge(1, 2);
      graph.addEdge(1, 1);

      var component = largestConnectedComponent(graph);

      assert.deepStrictEqual(component, ['1', '2']);
    });
  });

  describe('#.stronglyConnectedComponents', function() {

    it('should throw if given an invalid graph.', function() {
      assert.throws(function() {
        stronglyConnectedComponents(null);
      }, /graphology/);
    });

    it('should handle empty graphs.', function() {
      var graph = new Graph();

      assert.deepStrictEqual(stronglyConnectedComponents(graph), []);
    });

    it('should handle graphs without edges.', function() {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);

      assert.deepStrictEqual(stronglyConnectedComponents(graph), [['1'], ['2'], ['3']]);
    });

    it('should throw if the graph is undirected', function() {
      var graph = new Graph({type: 'undirected'});
      addNodesFrom(graph, [1, 2]);
      graph.addEdge(1, 2);

      assert.throws(function() {
        stronglyConnectedComponents(graph);
      }, /graphology/);
    });

    it('should return the correct components. (mixed edges)', function() {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3, 4]);

      graph.addDirectedEdge(1, 2);
      graph.addUndirectedEdge(2, 3);
      graph.addDirectedEdge(3, 4);
      graph.addDirectedEdge(4, 2);

      var components = stronglyConnectedComponents(graph);
      sortComponents(components);
      assert.deepStrictEqual(components, [['1'], ['2', '3', '4']]);
    });

    it('should return the correct components. (simple directed graph)', function() {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);

      graph.addDirectedEdge(1, 2);
      graph.addDirectedEdge(2, 1);
      graph.addDirectedEdge(3, 1);

      var components = stronglyConnectedComponents(graph);
      sortComponents(components);
      assert.deepStrictEqual(components, [['1', '2'], ['3']]);
    });

    it('should return the correct components. (disjointed components)', function() {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3, 4, 5, 6, 7, 8]);

      graph.addDirectedEdge(1, 2);
      graph.addDirectedEdge(2, 3);
      graph.addDirectedEdge(3, 1);

      graph.addDirectedEdge(3, 4);

      graph.addDirectedEdge(4, 5);
      graph.addDirectedEdge(5, 4);

      graph.addDirectedEdge(6, 7);
      graph.addDirectedEdge(7, 8);
      graph.addDirectedEdge(8, 6);

      var components = stronglyConnectedComponents(graph);
      sortComponents(components);

      assert.deepStrictEqual(components, [['1', '2', '3'], ['4', '5'], ['6', '7', '8']]);
    });
  });
});
