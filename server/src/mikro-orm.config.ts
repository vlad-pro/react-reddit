import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join( __dirname,"./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files; js is also included in the pattern
  },
  entities: [Post, User],
  dbName: "react_reddit",
  user: "postgres",
  password: "docker",
  port: 5432,
  host: "localhost",
  type: "postgresql",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0]; // This is some black magic to me right now.
// It's for TS to understand the type properply when importing, and for VSCode to do the autocompletion
