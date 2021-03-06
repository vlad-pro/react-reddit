import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  // Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import argon2 from "argon2";

// Using this class to pass it as InputType for Resolver functions, so reuse is there.
// It's possible to do the same with @Arg() decorator in function but clubersome
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

// This is for UserResponse object type to return an error object.
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

// This thing is for login mutation, it will return either user or error.
// User and errors fields are both optional and nullable. Can be done with TS Union
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  // a helper-testing query to check if the user is logged in or not
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext) {
    if (!ctx.req.session.userId) {
      return null; // you are not logged in
    }
    const user = await ctx.em.findOne(User, { id: ctx.req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    if (options.username.length < 1) {
      return {
        errors: [
          {
            field: "username",
            message: "username is empty",
          },
        ],
      };
    }
    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "password should be at least lenth 3",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = ctx.em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    try {
      await ctx.em.persistAndFlush(user);
    } catch (err) {
      // This is taken form conssole.log output
      if (err.code === "23505" || err.detail.includes("already exists")) {
        // duplicate username error
        return {
          errors: [
            {
              field: "username",
              message: "username already exists",
            },
          ],
        };
      }
      // console.log("message: ", err)
    }
    // loggin in a user by giving a cookie at the end of the registration.
    // store userId session 
    // this will set a cookie on the user and keep them logged in
    ctx.req.session.userId = user.id; 
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const user = await ctx.em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "username does not exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    ctx.req.session.userId = user.id; // by adding Express Session in types.ts for request we got session object to be always defined
    // OR we can use ctx.req.session!.userId = user.id to say that session object will be defined.
    return { user }; // return user object, no errors. This satisfies the return type.
  }
}
