import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import { setCookie } from "cookies-next";

export default handleAuth({
  async callback(req, res) {
    try {
      const result = await handleCallback(req, res);
      const user = result?.user;

      // Extract user role from Auth0 user metadata
      const userRole = user?.["https://yourdomain.com/roles"] || "customer"; // Adjust based on Auth0 role setup

      // Store the role in cookies
      setCookie("userRole", userRole, {
        req,
        res,
        maxAge: 60 * 60 * 24, // 1 day
        httpOnly: true,
      });

      return result;
    } catch (error) {
      res.status(500).end(error.message);
    }
  },
});
