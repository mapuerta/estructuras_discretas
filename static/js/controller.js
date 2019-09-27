$( document ).ready(function() {
    console.log( "ready!" );

class Controller {
    
    constructor(options) {
        this.nodes = {};
        this.edges = [];
        this.options = options || {};
        this.print_graph = null;
        this.NODES_CLICK = [];
    }

    delete_row(ctl) {
        $(ctl.currentTarget).parents('tr').remove()
    }
    
    get_table_edges(){
        var edges = [];
        var table_edges = $("#table_edges tr").not('.header_edges');
        table_edges.each(function (index, item) {
            var from_value = $(item).find('.edges_from select').val()
            var to_value = $(item).find('.edges_to select').val();
            edges.push(
                {'from':from_value,
                 'to': to_value,
                 }
            )
        });
        this.edges = edges;
        return edges;
    }
    
    hadler_graph_click(params){
        var current_node = params.nodes[0];
        $('.search_path').addClass('hidden');
        if (this.NODES_CLICK.includes(current_node)){
            var node_index = this.NODES_CLICK.indexOf(current_node);
            this.NODES_CLICK.pop(node_index)
            return false;
        }
        if (this.NODES_CLICK.length == 2){
            this.NODES_CLICK = [] 
        }
        this.NODES_CLICK.push(current_node);
        if (this.NODES_CLICK.length == 2){
            $('.search_path').removeClass('hidden')    
        }
        console.log("=============", this.NODES_CLICK)
        
    }

    post(path, parameters) {
        var form = $('<form></form>');
        form.attr("method", "post");
        form.attr("action", path);
        var field_count = $('<input></input>');
        var count = 1;
        $.each(parameters, function(key, value) {
                var field = $('<input></input>');
                count += 1;
                field.attr("type", "hidden");
                field.attr("name", key);
                field.attr("value", value);

                form.append(field);
            });
            $(document.body).append(form);
            form.submit();
    }
    
    addNode(table_id){
        
        var table = $("#"+table_id);
        var tr = $('<tr/>');
        var input = "<input class='form-control'/>"
        var td_input = $('<td/>').html(input);
        var act_remove = $("<a type='button' " +
                "class='btn btn-danger remove_row'>" +
                "<span class='glyphicon glyphicon-remove' />" +
        "</a>")
        var td_remove = $('<td class="text-center">').append(act_remove);
        act_remove.click(this.delete_row.bind(this));
        tr.append(td_input)
        tr.append(td_remove)
        table.find("tbody").append(tr)
    }
    
    addEdges(table_id){
        
        var table = $("#"+table_id);
        var tr = $('<tr/>');
        var select = $('<select></select>');
        var options = []
        $("td input").each(function (index, item) {
            var value = $(item).val();
            options.push({val : value, text: value})
        });
        $(options).each(function(index, item) {
             select.append($("<option>").attr('value',this.val).text(this.text));
        });
        var select = "<select class='form-control'>"+select.html()+"<select/>"
        var td_select1 = $('<td class="edges_from"/>').html(select);
        var td_select2 = $('<td class="edges_to"/>').html(select);
        var act_remove = $("<a type='button' " +
                "class='btn btn-danger remove_row'>" +
                "<span class='glyphicon glyphicon-remove' />" +
        "</a>")
        var td_remove = $('<td class="text-center">').append(act_remove);
        act_remove.click(this.delete_row.bind(this));
        tr.append(td_select1)
        tr.append(td_select2)
        tr.append(td_remove)
        table.find("tbody").append(tr)
    }

    addPaths(table_id){
        
        var select_id = $("#"+table_id);
        var select = $('<select></select>');
        var options = []
        $("td input").each(function (index, item) {
            var value = $(item).val();
            options.push({val : value, text: value})
        });
        $(options).each(function(index, item) {
             select_id.append($("<option>").attr('value',this.val).text(this.text));
        });
    }
    
    get_table_nodes(){
        var nodes = [];
        var table_nodes = $("#table_nodes tr input");
        table_nodes.each(function (index, item) {
            var value = $(item).val();
            nodes.push(
                {'id':value, 'label': value}
            )
        });
        return nodes;
    }
    deleteEdge (data, callback){
        var self = this;
        var edges = []
        $.each(this.edges, function(index, element){
           if (element.id != data.edges[0]){
               edges.push(element)
            } 
        })
        this.edges = edges;
        callback(data)
    }
    deleteNode (data, callback){
        var self = this;
        var nodes = []
        $.each(this.nodes, function(index, element){
           if (element.id != data.nodes[0]){
               edges.push(element)
            } 
        })
        this.nodes = nodes;
        callback(data)
    }


    create_grapth() {
        var self = this;
        this.NODES_CLICK = [];
        var nodes = this.get_table_nodes();
        var edges = this.get_table_edges();
        var graph_options = {
            interaction:{
                hover:true},
            manipulation: {
                    enabled: false,
                     addEdge: function (data, callback) {
                         self.edges.push(data)
                         callback(data)
                    },
                     deleteEdge: self.deleteEdge.bind(self),
                     deleteNode: self.deleteNode.bind(self),
                    
                },
          nodes: {
              size:40,
              color: {
                background: '#006400'
              },
              font:{color:'#eeeeee', "size": 30},

            }
        };
        this.nodes = nodes;
        var container = document.querySelector('#grapth_space');
        this.print_graph = new PrintGraph(nodes, edges, graph_options);
        this.print_graph.print_graph(container)
        //~ this.print_graph.delegateEvents('click', this.hadler_graph_click.bind(this))
        $("#add_join_edges").removeClass('hidden')
        $("#delete_join_edges").removeClass('hidden')
        $("#selected_path").removeClass('hidden')
        $("#input_from").removeClass('hidden')
        $("#input_to").removeClass('hidden')
        $("#lbl_input_to").removeClass('hidden')
        $("#lbl_input_from").removeClass('hidden')
        $('.search_path').removeClass('hidden') 
        this.print_graph.network.setOptions({
            nodes: {physics: false},
            edges: {physics: false},
        });
        this.addPaths("input_from")
        this.addPaths("input_to")
    }
}

    var graph = new Controller();
     
    $("#add_node").click(function() {
         graph.addNode("table_nodes");
    });
    $("#add_edges").click(function() {
         graph.addEdges("table_edges");
    });
    $("#graficate").click(function() {
         graph.create_grapth();
    });
    $("#add_join_edges").click(function() {
         graph.print_graph.network.addEdgeMode();
    });
    $("#delete_join_edges").click(function() {
         graph.print_graph.network.deleteSelected();
    });
    $(".search_path").click(function() {
        var edges = [];
        $.each(graph.edges, function(index, element){
            var new_element = Object.assign({}, element);
            new_element['to'] = element.from
            new_element['from'] = element.to
            edges.push(new_element)
        });
        edges = $.merge(graph.edges, edges);
        var data = {
            nodes: JSON.stringify(graph.nodes),
            edges: JSON.stringify(edges),
            node_start: $("#input_from").val(),
            node_end: $("#input_to").val(),
            algorithm: $(this).attr('id'),
        }
        graph.post("/process_root_graph", data);
    });

    
   


});
