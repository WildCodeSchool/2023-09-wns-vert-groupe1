import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, Float } from "type-graphql";
import { Length } from "class-validator";
import { Poi } from "./poi";
import { User } from "./user";

@ObjectType()
@Entity()
export class City extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  @Length(1, 255)
  name: string;

  @Field(() => Float)
  @Column("float")
  lat: number;

  @Field(() => Float)
  @Column("float")
  lon: number;

  @Field()
  @Column()
  description: string;

  @Field(() => [Poi])
  @OneToMany(() => Poi, (poi) => poi.city, { nullable: true })
  pois: Poi[];

  // a category can contain multiple ads
  @Field(() => [User])
  @OneToMany(() => User, (User) => User.city)
  users: User[];
}
