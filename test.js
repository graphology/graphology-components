/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert'),
    Graph = require('graphology');

var connectedComponents = require('./');

describe('graphology-components', function() {

  describe('index', function() {

    it('should throw if given an invalid graph.', function() {
      assert.throws(function() {
        connectedComponents(null);
      }, /graphology/);
    });

    it('should handle empty graphs.', function() {
      var graph = new Graph();

      assert.deepEqual(connectedComponents(graph), []);
    });

    it('should handle graphs without edges.', function() {
      var graph = new Graph();
      graph.addNodesFrom([1, 2, 3]);

      assert.deepEqual(connectedComponents(graph), [1, 2, 3]);
    });

    it('should return the correct components.', function() {
      var graph = new Graph();
      graph.addNodesFrom([1, 2, 3, 4, 5, 6, 7]);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);
      graph.addEdge(3, 4);
      graph.addEdge(2, 4);

      graph.addEdge(5, 6);

      var components = connectedComponents(graph);

      assert.deepEqual(components, [['1', '2', '4', '3'], ['5', '6'], ['7']]);
    });
  });
});
