import React from "react";
import Sunny from "../components/svg/sunny";
import Cloudy from "../components/svg/cloudy";
import PtCloudy from "../components/svg/partlyCloudy";
import CloudyWindy from "../components/svg/cloudyWindy";
import Windy from "../components/svg/windy";
import Rain from "../components/svg/rain";
import Snow from "../components/svg/snow";
import Scattered from "../components/svg/scattered";
import Thunderstorms from "../components/svg/tstorms";

export default function button(props) {
  return (
    <button>
      <div className="weather_button_col-2l">
        <div className="center">
          {props.weather === "Sunny" && <Sunny style="weather_icon_small" />}
          {props.weather === "Cloudy" && <Cloudy style="weather_icon_small" />}
          {props.weather === "Partly Cloudy" && (
            <PtCloudy style="weather_icon_small" />
          )}
          {props.weather === "Cloudy Windy" && (
            <CloudyWindy style="weather_icon_small" />
          )}
          {props.weather === "Windy" && <Windy style="weather_icon_small" />}
          {props.weather === "Rain" && <Rain style="weather_icon_small" />}
          {props.weather === "Snow" && <Snow style="weather_icon_small" />}
          {props.weather === "Thunderstorms" && (
            <Thunderstorms style="weather_icon_small" />
          )}
          {props.weather === "Scattered Showers" && (
            <Scattered style="weather_icon_small" />
          )}
        </div>
        <div className="center"> {props.weather}</div>
      </div>
    </button>
  );
}
