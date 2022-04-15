import { useSWRInfinite } from "swr";
import { useUser } from "@/hooks/index";
import Link from "next/link";
import fetcher from "@/lib/fetch";

function Post({ post }) {
  const user = useUser(post.creatorId);
  const t = ((post.AirTemp - 32) * 5) / 9;
  const w = ((post.temperature - 32) * 5) / 9;
  return (
    <div className="container">
      <h3>Recent Observations</h3>

      <table>
        <tr>
          <th>Date</th>
          <th>Location</th>
          <th>Air Temp</th>
          <th>Water Temp</th>
          <th>Notes</th>
          <th>Lat</th>
          <th>Lon</th>
        </tr>
        <tr>
          <td>{post.startdate}</td>
          <td>
            {post.location && <li>{post.location}</li>}
            {post.river && <li>Location: {post.river}</li>}
          </td>
          <td>{post.AirTemp} </td>
          <td>{post.temperature} </td>
          <td>{post.content} </td>
          <td>{post.lat} </td>
          <td>{post.lon} </td>
        </tr>
      </table>
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
