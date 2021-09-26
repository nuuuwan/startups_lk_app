import React, { Component } from "react";
import html2canvas from "html2canvas";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";

import { CATEGORIES } from "../../constants/CategoryConstants.js";
import { STARTUP_STAGES } from "../../constants/StartupStageConstants.js";
import { FUNDING_STAGES } from "../../constants/FundingStageConstants.js";
import Startups from "../../core/Startups.js";

import QRCode from "../../nonstate/atoms/QRCode.js";
import StartupInfo from "../../nonstate/molecules/StartupInfo.js";
import StartupScape from "../molecules/StartupScape.js";
import FilterPanel from "../molecules/FilterPanel.js";

import "./HomePage.css";

const URL_STARTUPSL_LK = "https://www.startupsl.lk/";
const URL_NUUUWAN = "https://twitter.com/nuuuwan";
// const URL_STARTUPSCAPE = "https://twitter.com/search?q=%23StartupScapeSL&f=top";
const MIN_WINDOW_INNER_WIDTH = 840;

function getGenericToIsSelected(values, isSelected) {
  return values.reduce(function (valueToIsSelected, value) {
    valueToIsSelected[value] = isSelected;
    return valueToIsSelected;
  }, {});
}

function getSelected(valueToIsSelected) {
  return Object.entries(valueToIsSelected)
    .filter(([value, isSelected]) => isSelected)
    .map(([value, isSelected]) => value);
}

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    const categoryToIsSelected = getGenericToIsSelected(CATEGORIES, true);
    const startupStageToIsSelected = getGenericToIsSelected(
      STARTUP_STAGES,
      true
    );
    const fundingStageToIsSelected = getGenericToIsSelected(
      FUNDING_STAGES,
      true
    );

    const activeStartupID = null;
    this.ref = React.createRef();

    const width = window.innerWidth;
    const rightPanelWidth = 0;
    const showFilterPanel = false;
    const showStartupInfo = false;

    this.state = {
      startupStageToIsSelected,
      fundingStageToIsSelected,
      categoryToIsSelected,
      activeStartupID,
      width,
      rightPanelWidth,
      showFilterPanel,
      showStartupInfo,
    };

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  onWindowResize(e) {
    const width = window.innerWidth;
    this.setState({ width });
  }

  onChangeCategory(categoryToIsSelected) {
    this.setState({ categoryToIsSelected });
  }

  onChangeStartupStage(startupStageToIsSelected) {
    this.setState({ startupStageToIsSelected });
  }

  onChangeFundingStage(fundingStageToIsSelected) {
    this.setState({ fundingStageToIsSelected });
  }

  onClickSelectAllCategories() {
    const categoryToIsSelected = getGenericToIsSelected(CATEGORIES, true);
    this.setState({ categoryToIsSelected });
  }
  onClickUnSelectAllCategories() {
    const categoryToIsSelected = getGenericToIsSelected(CATEGORIES, false);
    this.setState({ categoryToIsSelected });
  }

  onClickImage(startupID) {
    this.setState({ activeStartupID: startupID, showStartupInfo: true });
  }

  onClickStartupInfoHide() {
    this.setState({ activeStartupID: null });
  }

  onClickScreenCapture() {
    html2canvas(this.ref.current, {
      allowTaint: true,
      useCORs: true,
      width: window.innerWidth,
      height: window.innerHeight,
      scale: 5,
    }).then((canvas) => {
      const dataURL = canvas.toDataURL("image/svg+xml");
      let a = document.createElement("a");
      a.href = dataURL;
      a.download = "startups_lk.png";
      a.click();
    });
  }

  onRightPanelMakeVisible() {
    this.setState({ rightPanelWidth: 260 });
  }
  onRightPanelMakeNotVisible() {
    this.setState({ rightPanelWidth: 0 });
  }

  onToggleFilter() {
    this.setState({ showFilterPanel: !this.state.showFilterPanel });
  }

  onCloseStartupPanel() {
    this.setState({ showStartupInfo: false });
  }

  renderTitle() {
    return (
      <span>
        #<span className="color-maroon">S</span>
        <span className="color-orange">t</span>
        <span className="color-yellow">a</span>
        <span className="color-green">r</span>
        tupScapeSL
      </span>
    );
  }

  renderSubTitle() {
    const {
      categoryToIsSelected,
      startupStageToIsSelected,
      fundingStageToIsSelected,
    } = this.state;

    const startups = Startups.getFiltered(
      categoryToIsSelected,
      startupStageToIsSelected,
      fundingStageToIsSelected
    );

    const n = startups.length;
    const selectedCategories = getSelected(categoryToIsSelected);
    const selectedStartupStages = getSelected(startupStageToIsSelected);
    const selectedFundingStages = getSelected(fundingStageToIsSelected);

    const nCategories = selectedCategories.length;
    const nStartupStages = selectedStartupStages.length;
    const nFundingStages = selectedFundingStages.length;

    let displayCategory = "";
    if (nCategories > 0) {
      if (nCategories === 43) {
        displayCategory = " (all)";
      } else if (nCategories < 10) {
        displayCategory += " (" + selectedCategories.join(", ") + ")";
      }
    }

    let displayStartupStage = "";
    if (nStartupStages > 0) {
      if (nStartupStages === 6) {
        displayStartupStage = " (all)";
      } else {
        displayStartupStage += " (" + selectedStartupStages.join(", ") + ")";
      }
    }

    let displayFundingStage = "";
    if (nFundingStages > 0) {
      if (nFundingStages === 9) {
        displayFundingStage = " (all)";
      } else {
        displayFundingStage += " (" + selectedFundingStages.join(", ") + ")";
      }
    }

    return (
      <Typography variant="body1" gutterBottom>
        {`${n} Startups `}
        {` · ${nCategories} categories${displayCategory}`}
        {` · ${nStartupStages} startup stages${displayStartupStage}`}
        {` · ${nFundingStages} funding stages${displayFundingStage}`}
      </Typography>
    );
  }

  renderDisclaimer() {
    return (<Typography variant="body2" gutterBottom>
      {"This listing might not be exhaustive" +
        " · Categories, startup status and funding status" +
        " are self-reported by the startups" +
        " · Each startup might be categorized into multiple categories" +
        " · Last Updated 2021-09-24"}
    </Typography>);
  }

  renderNotSupported() {
    return (
      <div className="div-small-screen-warning">
        {this.renderTitle()}
        <Typography variant="body2" gutterBottom>
          {`This app is not designed for screens less than` +
            ` ${MIN_WINDOW_INNER_WIDTH}px wide.`}
        </Typography>
      </div>
    );
  }


  render() {
    if (window.innerWidth < MIN_WINDOW_INNER_WIDTH) {
      return this.renderNotSupported();
    }

    const {
      categoryToIsSelected,
      startupStageToIsSelected,
      fundingStageToIsSelected,
      activeStartupID,
      rightPanelWidth,
      showFilterPanel,
      showStartupInfo,
    } = this.state;

    const key = JSON.stringify({
      categoryToIsSelected,
      startupStageToIsSelected,
      fundingStageToIsSelected,
    });

    return (
      <div className="div-home-page" ref={this.ref}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {this.renderTitle()}
            </Typography>

            <Button
              color="inherit"
              onClick={this.onClickScreenCapture.bind(this)}
            >
              Download
            </Button>
            <Button color="inherit" onClick={this.onToggleFilter.bind(this)}>
              Filter
            </Button>
          </Toolbar>
        </AppBar>

        <div className="div-home-page-inner" ref={this.ref}>
          {this.renderSubTitle()}

          {this.renderDisclaimer()}

          <StartupScape
            key={key}
            categoryToIsSelected={categoryToIsSelected}
            startupStageToIsSelected={startupStageToIsSelected}
            fundingStageToIsSelected={fundingStageToIsSelected}
            onClickImage={this.onClickImage.bind(this)}
            rightPanelWidth={rightPanelWidth}
          />

          <div className="div-source">
            <table>
              <tbody>
                <tr>
                  <td>
                    Data by{" "}
                    <a href={URL_STARTUPSL_LK} target="_blank" rel="noreferrer">
                      startupsl.lk
                    </a>
                    · Visualization by{" "}
                    <a href={URL_NUUUWAN} target="_blank" rel="noreferrer">
                      @nuuuwan
                    </a>
                  </td>
                  <td>
                    <QRCode url={URL_NUUUWAN} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Drawer
          open={showFilterPanel}
          anchor="right"
          onClose={this.onToggleFilter.bind(this)}
        >
          <FilterPanel
            categoryToIsSelected={categoryToIsSelected}
            startupStageToIsSelected={startupStageToIsSelected}
            fundingStageToIsSelected={fundingStageToIsSelected}
            onChangeCategory={this.onChangeCategory.bind(this)}
            onChangeStartupStage={this.onChangeStartupStage.bind(this)}
            onChangeFundingStage={this.onChangeFundingStage.bind(this)}
            onClickSelectAllCategories={this.onClickSelectAllCategories.bind(
              this
            )}
            onClickUnSelectAllCategories={this.onClickUnSelectAllCategories.bind(
              this
            )}
            onRightPanelMakeVisible={this.onRightPanelMakeVisible.bind(this)}
            onRightPanelMakeNotVisible={this.onRightPanelMakeNotVisible.bind(
              this
            )}
          />
        </Drawer>

        <Drawer
          open={showStartupInfo}
          anchor="right"
          onClose={this.onCloseStartupPanel.bind(this)}
        >
          <StartupInfo startupID={activeStartupID} />
        </Drawer>
      </div>
    );
  }
}
