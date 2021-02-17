import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>; // We found that in em type in index.ts
  req: Request & {session: Express.Session}; // joining two types togeather with "&" and defining the session 
  res: Response;
};
