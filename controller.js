$( document ).ready(function() {
    console.log( "ready!" );

     function productDelete(ctl) {
        $(ctl.currentTarget).parents('tr').remove()
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
        act_remove.click(productDelete);
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
        act_remove.click(productDelete);
        tr.append(td_select1)
        tr.append(td_select2)
        tr.append(td_remove)
        table.find("tbody").append(tr)
    }

    function create_grapth() {
        var nodes = [];
        var edges = [];
        var table_nodes = $("#table_nodes tr input");
        table_nodes.each(function (index, item) {
            var value = $(item).val();
            nodes.push(
                {'id':value, 'label': value}
            )
        });
        var table_edges = $("#table_edges tr").not('.header_edges');
        table_edges.each(function (index, item) {
            var from_value = $(item).find('.edges_from select').val()
            var to_value = $(item).find('.edges_to select').val();
            edges.push(
                {'from':from_value, 'to': to_value}
            )
        });

        var options = {

            font:{
              size: 100,
            },
          nodes: {
              size:40,
              color: {
                background: '#006400'
              },
              font:{color:'#eeeeee', "size": 30},

            },

      };
        var data = {
            nodes: nodes,
            edges: edges,
        };
        var container = document.querySelector('#grapth_space');
 
        network = new vis.Network(container, data, options);
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

    
   


});
