import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

const main = async () => {
  const orm = await MikroORM.init({
    entities: [Post],
    dbName: "react_reddit",
    user: "postgres",
    password: "docker",
    port: 5432,
    host: "localhost",
    type: "postgresql",
    debug: !__prod__,
  });
};

console.log("Hi friends!");
