import { useSWRInfinite } from "swr";
import Link from "next/link";
import { useUser } from "@/hooks/index";
import fetcher from "@/lib/fetch";
import Sunny from "../svg/sunny";
import Cloudy from "../svg/cloudy";
import CloudyWindy from "../svg/cloudyWindy";
import CloudyGusts from "../svg/cloudyGusts";
import PtCloud from "../svg/partlyCloudy";
import Rain from "../svg/rain";
import Showers from "../svg/showers";
import Snow from "../svg/snow";
import Tstorms from "../svg/tstorms";
import Windy from "../svg/windy";

function Post({ post }) {
  const user = useUser(post.creatorId);
  const t = ((post.AirTemp - 32) * 5) / 9;
  const w = ((post.temperature - 32) * 5) / 9;
  return (
    <>
      <table>
        <tr>
          <th>Posted By:</th>
          <th>Sample Date:</th>
          <th>Location:</th>
          <th>Air Temp:</th>
          <th>Water Temp:</th>
          <th>Observed Weather</th>
          <th>Notes:</th>
        </tr>
        <td>
          {user && (
            <Link href={`/user/${user._id}`}>
              <>Posted By: {user.name}</>
            </Link>
          )}
        </td>
        <td>{post.startdate}</td>
        <td>
          {post.location && <> {post.location}</>}
          {post.river && <> {post.river}</>}
        </td>
        <td>{post.AirTemp}</td>
        <td>{post.temperature}</td>
        <td>
          <li>
            {post.weather === "Sunny" ? (
              <Sunny style="weather_icon_sm" />
            ) : null}
            {post.weather === "PtCLD" ? (
              <PtCloud style="weather_icon_sm" />
            ) : null}
            {post.weather === "Cld" ? <Cloudy style="weather_icon_sm" /> : null}
            {post.weather === "CldWind" ? (
              <CloudyWindy style="weather_icon_sm" />
            ) : null}
            {post.weather === "Wind" ? <Windy style="weather_icon_sm" /> : null}
            {post.weather === "Gusts" ? (
              <CloudyGusts style="weather_icon_sm" />
            ) : null}
            {post.weather === "Rain" ? <Rain style="weather_icon_sm" /> : null}
            {post.weather === "Scattered" ? (
              <Showers style="weather_icon_sm" />
            ) : null}
            {post.weather === "ScatteredTStorm" ? (
              <Tstorms style="weather_icon_sm" />
            ) : null}
            {post.weather === "Snow" ? <Snow style="weather_icon_sm" /> : null}
          </li>
        </td>
        <td>{post.content}</td>
      </table>

      {/* <div className="post__card">
        <div className="col-2">
          <div>
            <div>
              <ul>
                <li>Sample Date: {post.startdate}</li>

                {post.location && <li>Location: {post.location}</li>}
                {post.river && <li>Location: {post.river}</li>}
                <li>
                  Air Temperature: <b>{post.AirTemp}</b>
                  <sup>
                    º<small>F</small>
                  </sup>
                  &nbsp;~&nbsp;
                  <b> {Math.round(t.toFixed(2))}</b>
                  <sup>
                    º<small>C</small>
                  </sup>
                </li>

                <li>
                  Water Temperature: <b>{post.temperature}</b>
                  <sup>
                    º<small>F</small>
                  </sup>
                  &nbsp;~&nbsp;
                  <b>{Math.round(w.toFixed(2))}</b>
                  <sup>
                    º<small>C</small>
                  </sup>
                </li>
              </ul>
            </div>
            <div>
              <p>
                <p>
                  <b>Notes:</b> {post.content}
                </p>
              </p>
            </div>
          </div>

          <div className="stack">
            <div className="center"> </div>
            {post.temperature <= "62" ? (
              <>
                <div className="stack">
                  <div className="displayTempNormal center">
                    {post.temperature}
                    <sup>º</sup>F
                  </div>
                  <div className="center">Water Temperature</div>
                </div>
              </>
            ) : null}
            {post.temperature >= "63" && post.temperature <= "69" ? (
              <>
                <div className="stack">
                  <div className="displayTempWarn center">
                    {post.temperature}
                    <sup>º</sup>F{" "}
                  </div>
                  <div className="center">Water Temperature</div>
                </div>
              </>
            ) : null}
            {post.temperature >= "70" ? (
              <div className="stack">
                <div className="displayTempAlert center">
                  {post.temperature}
                  <sup>º</sup>F{" "}
                </div>
                <div className="center">Water Temperature</div>
              </div>
            ) : null}

            <div>
              <div className="center"></div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

const PAGE_SIZE = 500;

export function usePostPages({ creatorId } = {}) {
  return useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && previousPageData.posts.length === 0) return null;

      // first page, previousPageData is null
      if (index === 0) {
        return `/api/posts?limit=${PAGE_SIZE}${
          creatorId ? `&by=${creatorId}` : ""
        }`;
      }

      // using oldest posts createdAt date as cursor
      // We want to fetch posts which has a datethat is
      // before (hence the .getTime() - 1) the last post's createdAt
      const from = new Date(
        new Date(
          previousPageData.posts[previousPageData.posts.length - 1].createdAt
        ).getTime() - 1
      ).toJSON();

      return `/api/posts?from=${from}&limit=${PAGE_SIZE}${
        creatorId ? `&by=${creatorId}` : ""
      }`;
    },
    fetcher,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
    }
  );
}

export default function Posts({ creatorId }) {
  const { data, error, size, setSize } = usePostPages({ creatorId });

  const posts = data
    ? data.reduce((acc, val) => [...acc, ...val.posts], [])
    : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0].posts?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.posts.length < PAGE_SIZE);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
      {!isReachingEnd && (
        <button
          type="button"
          style={{
            background: "transparent",
            color: "#000",
          }}
          onClick={() => setSize(size + 1)}
          disabled={isReachingEnd || isLoadingMore}
        >
          {isLoadingMore ? ". . ." : "load more"}
        </button>
      )}
    </div>
  );
}
