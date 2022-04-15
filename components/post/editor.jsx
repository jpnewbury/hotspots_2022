import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/index";
import Slider from "react-input-slider";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Cloudy from "../svg/cloudy";
import Scattered from "../svg/scattered";
import CloudyWindy from "../svg/cloudyWindy";
import PartlyCloudy from "../svg/partlyCloudy";
import Sunny from "../svg/sunny";
import Thunderstorms from "../svg/tstorms";
import Windy from "../svg/windy";
import Rain from "../svg/rain";
import Gps from "../svg/gps";
import NoGps from "../svg/Gpsno";
import { longStackSupport } from "q";

export default function PostEditor() {
  const lat = localStorage.getItem("Latitude");
  const lon = localStorage.getItem("Longitude");
  const [user] = useCurrentUser();
  const [msg, setMsg] = useState(null);
  const [state, setState] = useState({ x: 55 });
  const [size, setSize] = useState({ x: 16 });
  const [water, setWater] = useState({ x: 55 });
  const [startdate, setStartDate] = useState(new Date());
  // const Lattitude = localStorage.getItem("Latitude");
  // const Longitude = localStorage.getItem("Longitude");
  const c = ((state.x - 32) * 5) / 9;
  const wc = ((water.x - 32) * 5) / 9;
  const l = size.x / 0.3937;
  const [weather, setWeather] = useState(0);
  // const [algae, setAlgae] = useState(0);
  const [river, setRiver] = useState(null);

  if (!user) {
    return <div>Please sign in to post</div>;
  }

  const onChange = (event) => {
    setAlgae(event.target.value);
  };

  const onLocation = (event) => {
    // sets the state property for the location
    setLocation(event.target.value);
  };
  const onOther = (event) => {
    // sets the state property for the other location
    setOther(event.target.value);
  };
  const onRiver = (event) => {
    // sets the state property for the location
    setRiver(event.target.value);
  };

  async function hanldeSubmit(e) {
    e.preventDefault();
    const body = {
      startdate: e.currentTarget.startdate.value,
      location: e.currentTarget.location.value,
      temperature: e.currentTarget.temperature.value,
      weather: e.currentTarget.weather.value,
      AirTemp: e.currentTarget.AirTemp.value,
      content: e.currentTarget.content.value,
      lat: e.currentTarget.lat.value,
      lon: e.currentTarget.lon.value,
      river: e.currentTarget.river.value,
    };

    if (!e.currentTarget.content.value) return;
    e.currentTarget.content.value = "";
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMsg("Your observation has been added");
      window.scrollTo(0, 0);
      setTimeout(() => setMsg(null), 1000);
    }
  }
  return (
    <div className="container">
      <div>
        <form onSubmit={hanldeSubmit} autoComplete="off">
          <span className="alert">{msg}</span>
          <div className="header">
            <>
              Hello, <b>{user ? user.name : null}</b>
            </>
          </div>

          <h3>Date:</h3>
          <section className="location">
            <div className="block">
              <DatePicker
                selected={startdate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                dateFormat="Pp"
              />
            </div>
            <div>
              <div className="hidden">
                <input
                  name="startdate"
                  type="text"
                  value={new Date(startdate).toLocaleString()}
                />
              </div>
              <div></div>
            </div>
          </section>
          <h3>Location:</h3>
          <section className="location">
            <div>
              <div>
                <h3>Select a River:</h3>
              </div>
              <select name="location">
                <option value="">Select:</option>
                <option value="Roaring Fork River - Upstream of Aspen">
                  Roaring Fork River - upstream of Aspen
                </option>
                <option value="Roaring Fork River - Aspen - Basalt">
                  Roaring Fork River - Aspen to Basalt
                </option>
                <option value="Roaring Fork River - Basalt to Carbondale">
                  Roaring Fork River - Basalt to Carbondale
                </option>
                <option value="Roaring Fork River - Carbondale to Mouth">
                  Roaring Fork River - Carbondale to Mouth
                </option>
                <option value="Fryingpan River above Reudi">
                  Fryingpan River above Reudi
                </option>
                <option value="Fryingpan River below Reudi">
                  Fryingpan River below Reudi
                </option>
                <option value="Crystal River usptream of Marble">
                  Crystal River - usptream of Marble
                </option>
                <option value="Crystal River Marble to Redstone">
                  Crystal River - Marble to Redstone
                </option>
                <option value="Crystal River Redstone to Mouth">
                  Crystal River - Redstone to confluence of Roaring Fork River
                </option>
                <option value="Maroon Creek">Maroon Creek</option>
                <option value="Castle Creek">Castle Creek</option>
                <option value="Snowmass Creek">Snowmass Creek</option>
                <option value="Cattle Creek above Coulter Creek">
                  Cattle Creek - above Coulter Creek
                </option>
                <option value="Cattle Creek below Coulter Creek">
                  Cattle Creek - below Coulter Creek
                </option>
                <option value="Colorado River upstream from confluence of Roaring Fork River">
                  Colorado River upstream from confluence of Roaring Fork River
                </option>
                <option value=" Colorado River downstream from confluence of Roaring Fork River">
                  Colorado River downstream of confluence of Roaring Fork River
                </option>
                <option value="Grizzly Cree">Grizzly Creek</option>
                <option value="No Name Creek">No Name Creek</option>
              </select>
              <input
                name="river"
                type="text"
                placeholder="Other Location"
                value={river}
                onChange={onRiver}
              />
            </div>

            <small>
              {!lat && (
                <>
                  <NoGps style="weather_icon" />
                  <p>
                    We cannot access your current position, please allow your
                    browser to access this location or log out and back in again
                    to activate.
                  </p>
                </>
              )}
              {lat && (
                <>
                  <div>
                    <h3>Waypoints:</h3>
                  </div>
                  <div className="col-2b">
                    <div className="">
                      <Gps style="weather_icon" />
                    </div>

                    <div></div>
                  </div>
                </>
              )}
              <div>
                <div className="center">
                  <input
                    type="text"
                    name="lat"
                    id="lat"
                    placeholder="Latitude"
                  />
                </div>
                <div className="center"></div>
                <div>{lat}</div>
              </div>
              <div className="">
                <div className="center">
                  <input
                    type="text"
                    name="lon"
                    id="lon"
                    placeholder="Longitude"
                  />
                </div>
                <div className="center"></div>
                <div>{lon}</div>
              </div>
              <div>
                <br />
                <p>
                  Placeholder values are showing your current location. If blank
                  or you are not at your sample location, please enter the
                  waypoints that you recorded from the field. If you have
                  allowed location access and your coordinates are not
                  displayed, loging out and back in again will show your current
                  position.
                </p>
              </div>
            </small>
          </section>
          <div className="block">
            <h3>Conditions:</h3>
          </div>
          <section className="location">
            <div className="block">
              <input
                className="hidden"
                name="weather"
                type="text"
                placeholder={weather}
                value={weather}
              />

              <h3>Weather:</h3>
              {weather === "Sunny" && <Sunny style="weather_icon" />}
              {weather === "PtCLD" && <PartlyCloudy style="weather_icon" />}
              {weather === "Cld" && <Cloudy style="weather_icon" />}
              {weather === "CldWind" && <CloudyWindy style="weather_icon" />}
              {weather === "Rain" && <Rain style="weather_icon" />}
              {weather === "Scattered" && <Scattered style="weather_icon" />}
              {weather === "Wind" && <Windy style="weather_icon" />}
              {weather === "ScatteredTStorm" && (
                <Thunderstorms style="weather_icon" />
              )}
              {weather === "Snow" && <Snow style="weather_icon" />}
              <div className="grid-ish">
                <div className="center weather_button">
                  <div>
                    {" "}
                    <Sunny style="small_icon" />
                  </div>
                  <div onClick={() => setWeather("Sunny")}>Sunny</div>
                </div>
                <div className="center weather_button">
                  <div>
                    {" "}
                    <PartlyCloudy style="small_icon" />
                  </div>
                  <div onClick={() => setWeather("PtCLD")}>Partly Cloudy</div>
                </div>
                <div className="center weather_button">
                  <div>
                    {" "}
                    <Cloudy style="small_icon" />
                  </div>
                  <div onClick={() => setWeather("Cld")}>Cloudy</div>
                </div>
                <div className="center weather_button">
                  <div>
                    {" "}
                    <CloudyWindy style="small_icon" />
                  </div>
                  <div onClick={() => setWeather("CldWind")}>Cloudy Windy</div>
                </div>
                <div className="center weather_button">
                  <div>
                    {" "}
                    <Windy style="small_icon" />
                  </div>
                  <div onClick={() => setWeather("Wind")}>Windy</div>
                </div>

                <div className="center weather_button">
                  <div>
                    {" "}
                    <Rain style="small_icon" />
                  </div>
                  <div onClick={() => setWeather("Rain")}>Rain</div>
                </div>
                <div className="center weather_button">
                  <div>
                    {" "}
                    <Scattered style="small_icon" />
                  </div>
                  <div onClick={() => setWeather("Scattered")}>
                    Scattered Showers
                  </div>
                </div>
                <div className="center weather_button">
                  <div>
                    {" "}
                    <Thunderstorms style="small_icon" />
                  </div>
                  <div onClick={() => setWeather("ScatteredTStorm")}>
                    Thunderstorms
                  </div>
                </div>
              </div>

              <div className="block">
                <h3>Air Temperature:</h3>
                <p>
                  {state.x}
                  <sup>º</sup>F ~ {c.toFixed(0)}
                  <sup>º</sup>C
                </p>
              </div>
              <div>
                <Slider
                  axis="x"
                  xstep={1}
                  xmin={0}
                  xmax={110}
                  x={state.x}
                  onChange={({ x }) =>
                    setState({ x: parseFloat(x.toFixed(2)) })
                  }
                />
              </div>
              <div className="hidden">
                <input
                  name="AirTemp"
                  type="text"
                  required="true"
                  value={state.x}
                />
              </div>
              <div>
                <div className="block">
                  <h3>Water Temperature:</h3>
                  {water.x}
                  <sup>º</sup>F ~ {wc.toFixed(0)}
                  <sup>º</sup>C
                </div>
                <div>
                  <Slider
                    axis="x"
                    xstep={1}
                    xmin={32}
                    xmax={100}
                    x={water.x}
                    onChange={({ x }) =>
                      setWater({ x: parseFloat(x.toFixed(2)) })
                    }
                  />
                </div>

                <div className="hidden">
                  <input
                    name="temperature"
                    type="text"
                    placeholder={water.x}
                    value={water.x}
                    required="true"
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="block">
              <h3>Field Notes:</h3>
            </div>
            <div>
              <textarea
                name="content"
                rows="4"
                cols="50"
                required="false"
                placeholder="Please tell us about your observations from this location. Include conditions such as algae accumulation, distressed or dead fish or foul odors."
              />
            </div>
          </section>

          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
}
