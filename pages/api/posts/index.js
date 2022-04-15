import nc from "next-connect";
import { all } from "@/middlewares/index";
import { getPosts, insertPost } from "@/db/index";

const handler = nc();

handler.use(all);

const maxAge = 1 * 24 * 60 * 60;

handler.get(async (req, res) => {
  const posts = await getPosts(
    req.db,
    req.query.from ? new Date(req.query.from) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  if (req.query.from && posts.length > 0) {
    // This is safe to cache because from defines
    //  a concrete range of posts
    res.setHeader("cache-control", `public, max-age=${maxAge}`);
  }

  res.send({ posts });
});

handler.post(async (req, res) => {
  if (!req.user) {
    return res.status(401).send("unauthenticated");
  }

  if (!req.body.content)
    return res.status(400).send("You must write something");

  const post = await insertPost(req.db, {
    creatorId: req.user._id,
    startdate: req.body.startdate,
    location: req.body.location,
    river: req.body.river,
    streamflow: req.body.streamflow,
    species: req.body.species,
    size: req.body.size,
    fly: req.body.fly,
    temperature: req.body.temperature,
    weather: req.body.weather,
    AirTemp: req.body.AirTemp,
    content: req.body.content,
    lat: req.body.lat,
    lon: req.body.lon,
    hatch: req.body.hatch,
  });

  return res.json({ post });
});

export default handler;
