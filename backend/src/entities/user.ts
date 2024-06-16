import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { City } from "./city";
import { IsNotEmpty } from "class-validator";

export enum UserRole {
  ADMIN = "Administrateur du site",
  CITYADMIN = "Administrateur de ville",
  SUPERUSER = "Super utilisateur",
  USER = "Utilisateur",
}
registerEnumType(UserRole, {
  name: "UserRole",
  description: "Role utilisateur",
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Column()
  @IsNotEmpty()
  hashedPassword: string;

  @Field(() => UserRole)
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // Many to One relationship (many users one city)
  @Field(() => City, { nullable: true })
  @ManyToOne(() => City, (city) => city.users, { onDelete: "CASCADE" })
  city?: City;
}
