import React from 'react';
// import CytoscapeComponent from "react-cytoscapejs";

var CytoscapeComponent = <h1>Loading</h1>;
var Cytoscape = <h1>Loading</h1>;
var COSEBilkent = <h1>Loading</h1>;

let options = {
  name: 'concentric',

  fit: true, // whether to fit the viewport to the graph
  padding: 30, // the padding on fit
  startAngle: (3 / 2) * Math.PI, // where nodes start in radians
  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
  minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  height: undefined, // height of layout area (overrides container height)
  width: undefined, // width of layout area (overrides container width)
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  concentric: function(node) {
    // returns numeric value for each node, placing higher nodes in levels towards the centre
    return node.degree();
  },
  levelWidth: function(nodes) {
    // the variation of concentric values in each level
    return nodes.maxDegree() / 4;
  },
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  animateFilter: function(node, i) {
    return true;
  }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function(node, position) {
    return position;
  } // transform a given node position. Useful for changing flow direction in discrete layouts
};

class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      width: 100,
      height: 100
    };
  }

  componentDidMount() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    CytoscapeComponent = require('react-cytoscapejs');
    Cytoscape = require('cytoscape');
    COSEBilkent = require('cytoscape-cose-bilkent');
    // Cytoscape.use(COSEBilkent);

    this.setState({ mounted: true, width: vw, height: vh }, function() {
      if (this.cy) {
        this.cy.resize();
        this.cy.fit();

        this.cy.on('click', e => {
          // Remove all previously set highlight classes
          this.cy.elements().removeClass('highlight');
          // Below logic will execute only on the graph drawn area
          if (e.target !== this.cy) {
            const sel = this.cy.$(`#${e.target.id()}`);
            if (sel.neighborhood('node').length > 0) {
              sel
                .addClass('highlight')
                .neighborhood('edge')
                .addClass('highlight');
              sel.neighborhood('node').addClass('highlight');
            }
          }
        });
      }
    });
  }

  render() {
    const { width, height } = this.state;
    const elements = [
      {
        data: { id: 'gene', label: 'The Gene' },
        position: { x: width / 2, y: height / 4 }
      },
      {
        data: {
          id: 'pathway',
          label: 'Pathway',
          width: 100,
          background: '#3EC0C1'
        },
        position: { x: width / 2 - 200, y: height / 2 }
      },
      {
        data: {
          id: 'disease',
          label: 'Disease',
          width: 100,
          background: '#ACD257'
        },
        position: { x: width / 2 - 70, y: height / 2 }
      },
      {
        data: {
          id: 'single_cell',
          label: 'Single Cell',
          width: 100,
          background: '#EB7B77'
        },
        position: { x: width / 2 + 70, y: height / 2 }
      },
      {
        data: {
          id: 'drug_interaction',
          label: 'Drug Interaction',
          width: 150,
          background: '#9C6795'
        },
        position: { x: width / 2 + 200, y: height / 2 }
      },
      {
        data: {
          id: 'single_cell_node',
          label: 'Kupffer Cell\nBTO_0000685',
          width: 200,
          background: '#9C6795'
        },
        position: { x: width / 2 + 70, y: height / 2 + 200 }
      },
      {
        data: {
          source: 'gene',
          target: 'pathway',
          label: 'Gene to pathway',
          type: 'DB2'
        }
      },
      {
        data: {
          source: 'gene',
          target: 'disease',
          label: 'Gene to disease',
          type: 'DB2'
        }
      },
      {
        data: {
          source: 'gene',
          target: 'single_cell',
          label: 'Gene to single_cell',
          type: 'DB2'
        }
      },
      {
        data: {
          source: 'gene',
          target: 'drug_interaction',
          label: 'Gene to drug_interaction',
          type: 'DB2'
        }
      },
      {
        data: {
          source: 'single_cell',
          target: 'single_cell_node',
          label: 'single_cell to single_cell_node',
          type: 'DB2'
        }
      }
    ];
    const stylesheet = [
      {
        selector: 'node',
        style: {
          'background-color': 'data(background)',
          label: 'data(label)',
          'text-valign': 'center',
          'text-halign': 'center',
          width: 'data(width)',
          'z-index': 1,
          shape: 'round-rectangle'
        }
      },
      {
        selector: 'node[label]',
        style: {
          label: 'data(label)'
        }
      },
      {
        selector: ':parent',
        style: {
          'background-color': 'green',
          'text-valign': 'top',
          'text-halign': 'left',
          'text-margin-x': '200px',
          color: 'green',
          'z-index': 2
        }
      },
      {
        selector: "edge[type='DB2']",
        style: {
          width: 2,
          'line-color': '#DDA448',
          'target-arrow-color': '#DDA448',
          'target-arrow-shape': 'triangle',
          'source-arrow-color': '#DDA448',
          // "source-arrow-shape": "triangle",
          'curve-style': 'taxi'
        }
      },
      {
        selector: '#gene',
        style: {
          shape: 'round-rectangle',
          width: 150,
          'background-color': '#BB342F',
          color: 'white'
        }
      },
      {
        selector: '#single_cell_node',
        style: {
          shape: 'round-rectangle',
          width: 'data(width)',
          height: '50',
          'background-color': '#BB342F',
          color: 'white',
          'text-wrap': 'wrap'
        }
      },
      {
        selector: 'node.highlight',
        style: {
          shape: 'round-rectangle',
          'background-color': 'rgb(0, 117, 186)',
          color: '#fff',
          'border-color': 'rgb(101, 196, 255)',
          'border-width': '1px',
          'font-weight': 'bold'
        }
      },
      {
        selector: 'edge.highlight',
        style: {
          shape: 'round-rectangle',
          'line-color': 'rgb(134, 134, 134)',
          width: '4px'
        }
      }
    ];

    const layout = { name: 'concentric' };
    // this.cy && this.cy.layout(options);
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        {this.state.mounted && (
          <CytoscapeComponent
            cy={cy => {
              this.cy = cy;
            }}
            stylesheet={stylesheet}
            elements={elements}
            layout={{ name: 'preset' }}
            style={{ width: this.state.width, height: this.state.height }}
          />
        )}
      </div>
    );
  }
}

export default HomeView;
