import React from "react";
import Image from "next/image";

import { useCurrentUser } from "@/hooks/index";
import PostEditor from "@/components/post/editor";
import Posts from "@/components/post/posts";
import Geo from "../components/geolocation";
import Table from "../components/post/postTable";

const IndexPage = () => {
  const [user] = useCurrentUser();

  return (
    <>
      {user ? (
        <>
          <Geo />
          <PostEditor />
          <Posts />
          {/* <Table /> */}
        </>
      ) : (
        <>
          <div>
            <Image
              src="/rfconservancy.png"
              height={200}
              width={200}
              alt="Roaring Fork Conservancy"
            />
          </div>
        </>
      )}
    </>
  );
};

export default IndexPage;
