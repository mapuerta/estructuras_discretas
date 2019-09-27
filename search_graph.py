import networkx as nx
import itertools
import pprint
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
        print("Grafo variable self.graph")
        pprint.pprint(self.graph)

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
        write_dot(graph, "grid.dot")
        dot_string = open("grid.dot", 'r').read()
        return dot_string

    def group_edges(self, edges):
        last_node = False
        result = []
        for edge in edges:
            if last_node:
                result += [(last_node, edge)]
            last_node = edge
        return result

    def create_graph_dfs_paths(self, graph):
        Grafo = nx.Graph()
        graph = list(graph)
        for node in set([n for r in graph for n in r]):
            Grafo.add_node(node)
        for edges in graph:
            for edge in self.group_edges(edges):
                Grafo.add_edge(edge[0], edge[1])
        return Grafo

    def create_graph_bfs_paths(self, graph):
        graph = list(graph)
        Grafo = nx.Graph()
        for node in self.graph:
            if node in [self.node_start, self.node_end]:
                Grafo.add_node(node, color="red")
                continue
            Grafo.add_node(node)
        for edge in self.edges:
            edge_from = edge['from']
            edge_to = edge['to']
            if [r for r in graph if len(set(r).intersection([edge_from, edge_to])) >= 2]:
                Grafo.add_edge(edge_from, edge_to, color='red')
            else:
                Grafo.add_edge(edge_from, edge_to)
        return Grafo

    def get(self, algorithm):
        func = self.dfs_paths
        if hasattr(self, algorithm):
            func = getattr(self, algorithm)
        result = func(self.node_start, self.node_end)
        graph = getattr(self, "create_graph_"+algorithm)(result)
        return self.export_dot_data(graph)

    def dfs_paths(self, node_start, node_end):
        stack = [(node_start, [node_start])]
        while stack:
            (vertex, path) = stack.pop()
            for next in self.graph[vertex] - set(path):
                if next == node_end:
                    yield path + [next]
                else:
                    stack.append((next, path + [next]))

    def bfs_paths(self, start, goal):
        queue = [(start, [start])]
        while queue:
            (vertex, path) = queue.pop(0)
            for next in self.graph[vertex] - set(path):
                if next == goal:
                    yield path + [next]
                else:
                    queue.append((next, path + [next]))
