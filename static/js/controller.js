$( document ).ready(function() {
    console.log( "ready!" );

    var NODES_CLICK = [];

    function delete_row(ctl) {
        $(ctl.currentTarget).parents('tr').remove()
    }
    
    function hadler_graph_click(params){
        var current_node = params.nodes[0];
        $('.search_path').addClass('hidden');
        if (NODES_CLICK.includes(current_node)){
            var node_index = NODES_CLICK.indexOf(current_node);
            NODES_CLICK.pop(node_index)
            return false;
        }
        if (NODES_CLICK.length == 2){
            NODES_CLICK = [] 
        }
        NODES_CLICK.push(current_node);
        if (NODES_CLICK.length == 2){
            $('.search_path').removeClass('hidden')    
        }
        console.log("=============", NODES_CLICK)
        
    }

    function post(path, parameters) {
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
    
    function addNode(table_id){
        
        var table = $("#"+table_id);
        var tr = $('<tr/>');
        var input = "<input class='form-control'/>"
        var td_input = $('<td/>').html(input);
        var act_remove = $("<a type='button' " +
                "class='btn btn-danger remove_row'>" +
                "<span class='glyphicon glyphicon-remove' />" +
        "</a>")
        var td_remove = $('<td class="text-center">').append(act_remove);
        act_remove.click(delete_row);
        tr.append(td_input)
        tr.append(td_remove)
        table.find("tbody").append(tr)
    }

    function addEdges(table_id){
        
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
        act_remove.click(delete_row);
        tr.append(td_select1)
        tr.append(td_select2)
        tr.append(td_remove)
        table.find("tbody").append(tr)
    }
    
    function get_table_nodes(){
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

    function get_table_edges(){
        var edges = [];
        var table_edges = $("#table_edges tr").not('.header_edges');
        table_edges.each(function (index, item) {
            var from_value = $(item).find('.edges_from select').val()
            var to_value = $(item).find('.edges_to select').val();
            edges.push(
                {'from':from_value, 'to': to_value}
            )
        });
        return edges;
    }

    function create_grapth() {
        NODES_CLICK = [];
        var nodes = get_table_nodes();
        var edges = get_table_edges();
        var graph_options = {
          nodes: {
              size:40,
              color: {
                background: '#006400'
              },
              font:{color:'#eeeeee', "size": 30},

            },
        };
        var container = document.querySelector('#grapth_space');
        var graph = new PrintGraph(nodes, edges, graph_options);
        graph.print_graph(container)
        graph.delegateEvents('click', hadler_graph_click.bind(this))
    }
            
    $("#add_node").click(function() {
         addNode("table_nodes");
    });
    $("#add_edges").click(function() {
         addEdges("table_edges");
    });
    $("#graficate").click(function() {
         create_grapth();
    });
    $(".search_path").click(function() {
        var data = {
            nodes: JSON.stringify(get_table_nodes()),
            edges: JSON.stringify(get_table_edges()),
            node_start: NODES_CLICK[0],
            node_end: NODES_CLICK[1],
            algorithm: $(this).attr('id'),
        }
        post("/process_root_graph", data);
    });

    
   


});
