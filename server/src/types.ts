import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>  // We found that in em type in index.ts
}