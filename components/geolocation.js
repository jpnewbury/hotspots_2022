import React, { Component } from "react";
class Geolocation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    navigator.geolocation.watchPosition(function (position) {
      localStorage.setItem("Latitude", position.coords.latitude);
      localStorage.setItem("Longitude", position.coords.longitude);
    });
  }
  render(tracking, set) {
    return <></>;
  }
}

export default Geolocation;
