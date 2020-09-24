import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  // Find all
  @Query(() => [Post])
  posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    return ctx.em.find(Post, {});
  }

  // Find the exact one
  @Query(() => Post, { nullable: true }) // Some attention to the types (2)
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> { // Some attention to the types (2)
    return ctx.em.findOne(Post, { id });
  }
}
