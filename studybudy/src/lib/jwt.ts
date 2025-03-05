import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateJWTToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyJWTToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
