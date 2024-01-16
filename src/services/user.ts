import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";
export interface createUserProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface loginUserProps {
  email: string;
  password: string;
}

class UserServices {
  private static generateHash(salt: string, password: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }
  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }
  public static createUser(props: createUserProps) {
    const { firstName, lastName, email, password } = props;
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = UserServices.generateHash(salt, password);
    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      },
    });
  }
  public static async loginUser(props: loginUserProps) {
    const { email, password } = props;

    const user = await UserServices.getUserByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const userSalt = user.salt;
    const userHashedPassword = UserServices.generateHash(userSalt, password);
    if (user.password !== userHashedPassword)
      throw new Error("Invalid credentials");
    const secret = process.env.SECRET_KEY || "your_Secret";
    const token = JWT.sign({ id: user.id, email: user.email }, secret);
    return token;
  }
}

export default UserServices;
