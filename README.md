# Graphology Components

Connected components for [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-components
```

## Usage

* [Connected components](#connected-components)
* [Strongly connected components](#strongly-connected-components)

### Connected components

Returns the list of connected components of the given graph.

```js
import {connectedComponents} from 'graphology-components';

const components = connectedComponents(graph);
```

If `graph` is a mixed or directed graph, the result will be the list of **weakly connected components.**

### Strongly connected components

Returns the list of strongly connected components of the given graph. (mixed or directed)

```js
import {stronglyConnectedComponents} from 'graphology-components';

const components = stronglyConnectedComponents(graph);
```
