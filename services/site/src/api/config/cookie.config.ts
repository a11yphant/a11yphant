import { registerAs } from "@nestjs/config";

export default registerAs("cookie", () => ({
  name: "a11yphant_session",
  defaultConfig: { sameSite: "lax", secure: true, httpOnly: true },
}));
