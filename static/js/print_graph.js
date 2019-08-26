class PrintGraph {
    constructor(nodes, edges, options) {
        this.nodes = nodes || [];
        this.edges = edges || [];
        this.options = options || {};
        this.network = null;
    }
    print_graph(element) {
        var data = {
            nodes: this.nodes,
            edges: this.edges,
        };
        this.network = new vis.Network(element, data, this.options);
    }
    set_dot_data(parser_data){
        this.nodes = parser_data.nodes,
        this.edges = parser_data.edges
    }
    import_dot_data(element, DOTstring){
        var parser_data = vis.network.convertDot(DOTstring);
        this.set_dot_data(parser_data)
        var data = {
          nodes: this.nodes,
          edges: this.edges
        }
        var options = parser_data.options;
        options = $.extend(options, this.options);
        this.network = new vis.Network(element, data, options);
    }
    delegateEvents(event, hadler) {
        if (!this.network){
            return false;
        }
        var $el = this.network;
        $el.on(event, hadler);
    }
}
