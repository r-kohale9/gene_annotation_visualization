import React, { Component } from 'react';

class GeneComponent extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     mounted: false,
  //     width: 0,
  //     height: 0,
  //   };
  // }

  // componentDidMount() {
  //   const vw = Math.max(
  //     document.documentElement.clientWidth || 0,
  //     window.innerWidth || 0
  //   );
  //   const vh = Math.max(
  //     document.documentElement.clientHeight || 0,
  //     window.innerHeight || 0
  //   );
  //   CytoscapeComponent = require("react-cytoscapejs");
  //   this.setState({ mounted: true, width: vw, height: vh });
  // }

  render() {
    const { CytoscapeComponent, width, height } = this.props;
    const elements = [
      {
        data: { id: 'one', label: 'Node 1' },
        position: { x: width / 2 - 80, y: height / 2 }
      },
      {
        data: { id: 'two', label: 'Node 2' },
        position: { x: width / 2 + 80, y: height / 2 }
      },
      {
        data: {
          source: 'one',
          target: 'two',
          label: 'Edge from Node1 to Node2'
        }
      }
    ];

    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        {this.state.mounted && <CytoscapeComponent elements={elements} style={{ width: width, height: height }} />}
      </div>
    );
  }
}

export default GeneComponent;
