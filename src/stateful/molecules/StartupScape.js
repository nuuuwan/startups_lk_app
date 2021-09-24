import { Component } from "react";

import Startups from "../../core/Startups.js";
import TreeMap from "../../nonstate/molecules/TreeMap.js";

import "./StartupScape.css";
const WIDHT_PADDING = 24;
const HEIGHT_HEADER = 100;
const HEIGHT_FOOTER = 100;

export default class StartupScape extends Component {
  render() {
    const {
      categoryToIsSelected,
      startupStageToIsSelected,
      fundingStageToIsSelected,
    } = this.props;
    const treemapData = Startups.getTreeMapData(
      categoryToIsSelected,
      startupStageToIsSelected,
      fundingStageToIsSelected
    );
    const height = window.innerHeight  - HEIGHT_FOOTER -HEIGHT_HEADER ;
    const width = window.innerWidth - WIDHT_PADDING * 2;
    return (
      <div className="div-startup-scape">
        <TreeMap data={treemapData} height={height} width={width} />
      </div>
    );
  }
}
