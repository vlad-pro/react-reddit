import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType() // This is turning a Class into a graphQL type. And it will be an ObjectType and an Entity because we are stacking decorators
@Entity()
export class Post {
  @Field(() => Int) // This exposes field to graphQL schema and the expression in the parenthesis is setting the type of the field
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() }) // we can use type to explicitly state the type of field in the DB during migration
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
}
