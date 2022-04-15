import React from "react";
import { useSWRInfinite } from "swr";
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

import { useCurrentUser } from "@/hooks/index";
function Post({ post }) {
  const user = useUser(post.creatorId);
  const c = post.size / 0.3937; // converts fish length to centimeters
  const t = ((post.AirTemp - 32) * 5) / 9;

  return (
    <div className="container">
      <div className="post__card">
        <div className="col-2">
          <div>
            <div>
              <small>{post.startdate}</small>
            </div>
            <div>
              <ul>
                <li>
                  <b>Species:</b> {post.species}
                </li>
                <li>
                  <b>Length:</b> {post.size} inch ~ {Math.round(c.toFixed(2))}{" "}
                  centimeter{" "}
                </li>
                <li>
                  <b>Fly Used:</b> {post.fly}
                </li>
              </ul>
              <p>
                <b>Notes:</b> {post.content}
              </p>
            </div>
          </div>
          <div className="center">
            <div>
              <div>
                {post.weather === "Sunny" ? (
                  <Sunny style="weather_icon" />
                ) : null}
                {post.weather === "PtCLD" ? (
                  <PtCloud style="weather_icon" />
                ) : null}
                {post.weather === "Cld" ? (
                  <Cloudy style="weather_icon" />
                ) : null}
                {post.weather === "CldWind" ? (
                  <CloudyWindy style="weather_icon" />
                ) : null}
                {post.weather === "Wind" ? (
                  <Windy style="weather_icon" />
                ) : null}
                {post.weather === "Gusts" ? (
                  <CloudyGusts style="weather_icon" />
                ) : null}
                {post.weather === "Rain" ? <Rain /> : null}
                {post.weather === "Scattered" ? (
                  <Showers style="weather_icon" />
                ) : null}
                {post.weather === "ScatteredTStorm" ? (
                  <Tstorms style="weather_icon" />
                ) : null}
                {post.weather === "Snow" ? <Snow style="weather_icon" /> : null}
              </div>
              <div className="center">
                {post.AirTemp}
                <sup>
                  º<small>F</small>
                </sup>
                &nbsp;~&nbsp;
                {Math.round(t.toFixed(2))}
                <sup>
                  º<small>C</small>
                </sup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

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
