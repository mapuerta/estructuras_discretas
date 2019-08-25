import networkx as nx
try:
    import pygraphviz
    from networkx.drawing.nx_agraph import write_dot
    print("using package pygraphviz")
except ImportError:
    try:
        import pydot
        from networkx.drawing.nx_pydot import write_dot
        print("using package pydot")
    except ImportError:
        print()
        print("Both pygraphviz and pydot were not found ")
        print("see  https://networkx.github.io/documentation/latest/reference/drawing.html")
        print()


class SearchGraphPath:
    def __init__(self, nodes, edges, node_start, node_end):
        self.node_start = node_start
        self.node_end = node_end
        self.nodes = nodes
        self.edges = edges
        self.graph = {}
        self.create_graph()

    def create_graph(self):
        graph = {}
        for node in self.nodes:
            node = node['id']
            graph.setdefault(node, set())
            graph[node] |= self.add_edges_from_node(node)
        self.graph = graph
        return graph

    def add_edges_from_node(self, node):
        edges = [
            edge['to'] for edge in self.edges if edge['from'] == node]
        return set(edges)

    def export_dot_data(self, graph):
        Grafo = nx.Graph()
        for nodes in graph:
            for node in nodes:
                Grafo.add_node(node)
            Grafo.add_edge(*nodes)
        write_dot(Grafo, "grid.dot")
        dot_string = open("grid.dot", 'r').read()
        return dot_string

    def get(self, algorithm):
        func = self.dfs_paths
        if hasattr(self, algorithm):
            func = getattr(self, algorithm)
        return self.export_dot_data(
            func(self.node_start, self.node_end))

    def dfs_paths(self, node_start, node_end):
        stack = [(node_start, [node_start])]
        while stack:
            (vertex, path) = stack.pop()
            for next in self.graph[vertex] - set(path):
                if next == node_end:
                    yield path + [next]
                else:
                    stack.append((next, path + [next]))
        return stack

    def bfs_paths(self, start, goal):
        queue = [(start, [start])]
        while queue:
            (vertex, path) = queue.pop(0)
            for next in self.graph[vertex] - set(path):
                if next == goal:
                    yield path + [next]
                else:
                    queue.append((next, path + [next]))
        return queue
