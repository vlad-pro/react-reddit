import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up(); // Run the migrations after connecting to the db

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  // order is important here  - we are going to put session inside of a apollo server so  it shoudl be available BEFORE
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
      },
      secret: "youwillneverguess",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }), 
    // This opens the contex to other operations and functions to use ORM connection. 
    // We got the em type and created MyContext in types.ts. 
    // UPD: got the req and res objects in the context so we can access the session in the resolver
  });

  apolloServer.applyMiddleware({ app });

  // This is a test for express. It's a REST api test but we are using GQL in here so it's commented
  // app.get("/", (_, res) => { // to ignore the request (req) we are using an underscore, looks like go/python
  //   res.send("hello")
  // });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
  // ====== creating entities ======
  // const post = orm.em.create(Post, { title: "my first post" });
  // await orm.em.persistAndFlush(post);

  // ====== listing entities ======
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};

main().catch((err) => {
  console.log(err);
});
