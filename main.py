from flask import Flask, render_template
from flask import request
from search_graph import SearchGraphPath
import json


app = Flask(__name__, static_url_path='/static')


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('main_grapt.html')

@app.route('/process_root_graph', methods=['GET', 'POST'])
def process_root_graph(**kw):
    nodes = json.loads(request.form['nodes'])
    edges = json.loads(request.form['edges'])
    #~ node_start = request.form['node_start']
    node_start = "A"
    #~ node_end = request.form['node_end']
    node_end = "B"
    algorithm = request.form['algorithm']
    dotdata = SearchGraphPath(
        nodes, edges, node_start, node_end).get(algorithm)
    return render_template('graph.html', dotdata=dotdata)


if __name__ == '__main__':
    app.run(port=8080)
