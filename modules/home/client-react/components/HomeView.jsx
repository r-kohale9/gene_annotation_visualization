import React from 'react';
import { Spin } from 'antd'
// import CytoscapeComponent from "react-cytoscapejs";

var CytoscapeComponent = <h1>Loading</h1>;
var Cytoscape = <h1>Loading</h1>;
var COSEBilkent = <h1>Loading</h1>;

const layoutOptions = {
  name: 'concentric',

  fit: true, // whether to fit the viewport to the graph
  padding: 30, // the padding on fit
  startAngle: 3 / 2 * Math.PI, // where nodes start in radians
  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  // clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
  minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  height: undefined, // height of layout area (overrides container height)
  width: undefined, // width of layout area (overrides container width)
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  concentric: function (node) {
    // console.log('node', node.data('level'))
    return node.data("level");
  },
  // levelWidth: function( nodes ){ // the variation of concentric values in each level
  // return nodes.maxDegree() / 4;
  // },
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  animateFilter: function (node, i) { return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position) { return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
};

function longestWord(string) {
  var str = string.split(" ");
  var longest = 0;
  var word = null;
  for (var i = 0; i < str.length; i++) {
    if (longest < str[i].length) {
      longest = str[i].length;
      word = str[i];
    }
  }
  return word;
}

function chunk(str) {
  // var ret = [];
  // var i;
  // var len;
  // var prevIndex = 0;
  // for(i = 0, len = str.length; i <= len; i += 1) {
  //     if(str[i] == ' ' || i == len){
  //       const substring = str.substr(prevIndex, i)
  //       ret.push(substring);
  //       prevIndex += substring.length;
  //     }
  // }
  // console.log('chunk', ret);

  const modifiedString = str ? str.replace(/\s+/g, '\n') : '';
  const spaceCount = str ? str.split(/\s+/g).length - 1 : '';
  const longestWordStr = str ? longestWord(str) : '';
  const longestWordLength = longestWordStr ? longestWordStr.length : 0;
  return { modifiedString, spaceCount, longestWordLength }
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
    Cytoscape.use(COSEBilkent);

    this.setState({ mounted: true, width: vw, height: vh }, function () {
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
    const { gene } = this.props;
    var elements = [
      gene && gene.geneName ?
        { data: { id: 'gene', label: chunk(gene.geneName).modifiedString , level: 1, width: chunk(gene.geneName).longestWordLength * 30 + 50, height: chunk(gene.geneName).spaceCount * 50 + 30 }, }
        : {
          data: { id: 'gene', label: 'The Gene', level: 1, width: '300', height: 200 },

          // position: { x: width / 2, y: height / 2 }
        },
      {
        layout: 'concentric',
        data: {
          id: 'pathway',
          label: 'Pathway',
          width: 100,
          height: 50,
          background: '#3EC0C1',
          level: 2
        },
        position: { x: width / 2 - 200, y: height / 2 }
      },
      {
        data: {
          id: 'disease',
          label: 'Disease',
          width: 100,
          height: 50,
          background: '#8dc515',
          level: 2
        },
        position: { x: width / 2, y: height / 2 - 200 }
      },
      {
        data: {
          id: 'single_cell',
          label: 'Single Cell',
          width: 100,
          height: 50,
          background: '#EB7B77',
          level: 2
        },
        position: { x: width / 2 + 200, y: height / 2 }
      },
      {
        data: {
          id: 'drug_interaction',
          label: 'Drug Interaction',
          width: 150,
          height: 50,
          background: '#9C6795',
          level: 2
        },
        position: { x: width / 2, y: height / 2 + 200 }
      },

      {
        data: {
          source: 'gene',
          target: 'pathway',
          label: 'Gene to pathway',
          // type: 'DB2'
        }
      },
      {
        data: {
          source: 'gene',
          target: 'disease',
          label: 'Gene to disease',
          // type: 'DB2'
        }
      },
      {
        data: {
          source: 'gene',
          target: 'single_cell',
          label: 'Gene to single_cell',
          // type: 'DB2'
        }
      },
      {
        data: {
          source: 'gene',
          target: 'drug_interaction',
          label: 'Gene to drug_interaction',
          // type: 'DB2'
        }
      },

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
          height: 'data(height)',
          'z-index': 1,
          shape: 'round-rectangle',
          'text-wrap': 'wrap'
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
        selector: "edge",
        style: {
          width: 2,
          'line-color': '#DDA448',
          'target-arrow-color': '#DDA448',
          'target-arrow-shape': 'triangle',
          'source-arrow-color': '#DDA448',
          // "source-arrow-shape": "triangle",
          'curve-style': 'straight',
        }
      },
      {
        selector: '#gene',
        style: {
          shape: 'round-rectangle',
          // width: 150,
          'font-size':'30px',
          'background-color': '#BB342F',
          color: 'white'
        }
      },
      {
        selector: '#disease',
        style: {
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

    const populateGraph = (geneData) => {
      const { pathways, cellSpecificMarkers, diseaseInteractions, drugInteractions } = geneData;
      pathways && pathways.map((pathway, key) => {
        const { modifiedString, spaceCount, longestWordLength } = chunk(pathway.pathwayName)
        elements.push({

          data: {
            id: `pathway-element-${pathway.id}`,
            label: modifiedString,
            width: (longestWordLength * 10 + 40),
            height: (spaceCount * 20 + 20),
            background: '#9C6795',
            level: 1
          },
          // position: { x: width / 2 - 600, y: height / 2 + 200 * (key + 1) }
        });
        elements.push({
          data: {
            source: 'pathway',
            target: `pathway-element-${pathway.id}`,
            label: `pathway to ${pathway.id}`,
            // type: 'DB2'
          }
        })
      });
      cellSpecificMarkers && cellSpecificMarkers.map((cellSpecificMarker, key) => {
        const { modifiedString, spaceCount, longestWordLength } = chunk(cellSpecificMarker.cellName)
        elements.push({
          data: {
            id: `cellSpecificMarker-element-${cellSpecificMarker.id}`,
            label: modifiedString,
            width: (longestWordLength * 10 + 40),
            height: (spaceCount * 20 + 20),
            background: '#9C6795',
            level: 1
          },
          // position: { x: width / 2 - 600, y: height / 2 + 200 * (key + 1) }
        });
        elements.push({
          data: {
            source: 'single_cell',
            target: `cellSpecificMarker-element-${cellSpecificMarker.id}`,
            label: `cellSpecificMarker to ${cellSpecificMarker.id}`,
            // type: 'DB2'
          }
        })
      })
      diseaseInteractions && diseaseInteractions.map((diseaseInteraction, key) => {
        const { modifiedString, spaceCount, longestWordLength } = chunk(diseaseInteraction.diseaseName)
        elements.push({
          data: {
            id: `diseaseInteraction-element-${diseaseInteraction.id}`,
            label: modifiedString,
            width: (longestWordLength * 10 + 40),
            height: (spaceCount * 20 + 20),
            background: '#9C6795',
            level: 1
          },
          // position: { x: width / 2 - 600, y: height / 2 + 200 * (key + 1) }
        });
        elements.push({
          data: {
            source: 'disease',
            target: `diseaseInteraction-element-${diseaseInteraction.id}`,
            label: `diseaseInteraction to ${diseaseInteraction.id}`,
            // type: 'DB2'
          }
        })
      });
      drugInteractions && drugInteractions.map((drugInteraction, key) => {
        const { modifiedString, spaceCount, longestWordLength } = drugInteraction.drugName !== '' ? chunk(drugInteraction.drugName) : chunk(drugInteraction.drugClaimName)
        elements.push({
          data: {
            id: `drugInteraction-element-${drugInteraction.id}`,
            label: modifiedString,
            width: (longestWordLength * 10 + 40),
            height: (spaceCount * 20 + 20),
            background: '#9C6795',
            level: 1
          },
          // position: { x: width / 2 - 600, y: height / 2 + 200 * (key + 1) }
        });
        elements.push({
          data: {
            source: 'drug_interaction',
            target: `drugInteraction-element-${drugInteraction.id}`,
            label: `drugInteraction to ${drugInteraction.id}`,
            // type: 'DB2'
          }
        })
      });
      // this.cy && this.cy.elements().id('pathway').layout({name:'concentric'}).run()
    }
    !this.props.loading && this.state.mounted && gene && populateGraph(gene);
    console.log('geneData', gene, this.cy);
    const layout = { name: 'concentric' };
    // this.cy && this.cy.layout(options);
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        {this.state.mounted && !this.props.loading ? (
          <CytoscapeComponent
            cy={cy => {
              this.cy = cy;
            }}
            stylesheet={stylesheet}
            elements={elements}
            layout={{
              name: 'breadthfirst',
              directed: true,
              circle: true,
              spacingFactor:0.7,
              grid:true,
              // concentric: function (node) {
              //   return node.degree();
              // },
              // levelWidth: function (nodes) {
              //   return 2;
              // }
            }}
            style={{ width: this.state.width, height: this.state.height }}
          />
        ) : <div style={{ display: 'grid', placeItems: 'center', height: '100%', width: '100%' }}><Spin /></div>}
      </div>
    );
  }
}

export default HomeView;
