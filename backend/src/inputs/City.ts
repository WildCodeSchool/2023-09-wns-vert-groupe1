import { Field, InputType } from "type-graphql";

@InputType()
export class CityInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [Number], { nullable: true })
  pois?: [number];
}
