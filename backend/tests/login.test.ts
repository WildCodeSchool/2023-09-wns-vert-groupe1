import { describe, expect, it, jest } from "@jest/globals";
import { UserResolver } from "../src/resolvers/User";
import { User, UserRole } from "../src/entities";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

jest.mock("argon2");
jest.mock("jsonwebtoken");

describe("UserResolver", () => {
  describe("login", () => {
    it("should return a token when login is successful", async () => {
      const mockUser = new User();
      mockUser.email = "test@example.com";
      mockUser.hashedPassword = "hashedPassword";
      mockUser.role = UserRole.USER;

      const findOneByOrFailSpy = jest
        .spyOn(User, "findOneByOrFail")
        .mockResolvedValue(mockUser);

      const verifySpy = jest.spyOn(argon2, "verify").mockResolvedValue(true);

      const signSpy = jest.spyOn(jwt, "sign").mockImplementation(() => {
        return "mockToken";
      });

      const resolver = new UserResolver();
      const result = await resolver.login({
        email: "test@example.com",
        password: "password",
      });

      expect(result).toEqual(JSON.stringify({ token: "mockToken" }));
      expect(findOneByOrFailSpy).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(verifySpy).toHaveBeenCalledWith("hashedPassword", "password");
      expect(signSpy).toHaveBeenCalledWith(
        { email: "test@example.com", role: UserRole.USER },
        process.env.SECRET_KEY
      );

      findOneByOrFailSpy.mockRestore();
      verifySpy.mockRestore();
      signSpy.mockRestore();
    });

    it("should throw an error when password is incorrect", async () => {
      const mockUser = new User();
      mockUser.email = "test@example.com";
      mockUser.hashedPassword = "hashedPassword";

      jest.spyOn(User, "findOneByOrFail").mockResolvedValue(mockUser);
      jest.spyOn(argon2, "verify").mockResolvedValue(false);

      const resolver = new UserResolver();

      await expect(
        resolver.login({ email: "test@example.com", password: "wrongPassword" })
      ).rejects.toThrow("Invalid password");

      jest.restoreAllMocks();
    });

    it("should throw an error when user is not found", async () => {
      jest.spyOn(User, "findOneByOrFail").mockImplementation(() => {
        throw new Error("User not found");
      });

      const resolver = new UserResolver();

      await expect(
        resolver.login({ email: "test@example.com", password: "password" })
      ).rejects.toThrow("User not found");

      jest.restoreAllMocks();
    });
  });
});
