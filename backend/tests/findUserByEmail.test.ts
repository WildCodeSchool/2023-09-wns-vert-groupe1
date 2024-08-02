import { describe, expect, it, jest } from "@jest/globals";
import { UserResolver } from "../src/resolvers/User";
import { User } from "../src/entities";

describe("UserResolver", () => {
  describe("findUserByEmail", () => {
    it("should return user when user is found", async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.email = "test@example.com";

      const findOneByOrFailSpy = jest
        .spyOn(User, "findOneByOrFail")
        .mockResolvedValue(mockUser);

      const resolver = new UserResolver();
      const result = await resolver.getUserByEmail("test@example.com");

      expect(result).toEqual(mockUser);
      expect(findOneByOrFailSpy).toHaveBeenCalledWith({
        email: "test@example.com",
      });

      findOneByOrFailSpy.mockRestore();
    });

    it("should throw error when user is not found", async () => {
      const findOneByOrFailSpy = jest
        .spyOn(User, "findOneByOrFail")
        .mockImplementation(() => {
          throw new Error("User not found");
        });

      const resolver = new UserResolver();

      await expect(resolver.getUserByEmail("test@example.com")).rejects.toThrow(
        "Error : Error: User not found"
      );
      expect(findOneByOrFailSpy).toHaveBeenCalledWith({
        email: "test@example.com",
      });

      findOneByOrFailSpy.mockRestore();
    });
  });
});
