import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {
  @PrimaryKey()
  id!: number;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() }) // we can use type to explicitly state the type of field in the DB during migration
  updatedAt = new Date();

  @Property({ type: "text" })
  title!: string;
}
