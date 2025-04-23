import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import { setCookie } from "cookies-next";

export default handleAuth({
  async callback(req, res) {
    try {
      const result = await handleCallback(req, res);
      const user = result?.user;

      if (!user) {
        throw new Error('No user data received from Auth0');
      }

      // Extract user role from Auth0 user metadata using the correct namespace
      const userRole = user?.[`${process.env.AUTH0_ISSUER_BASE_URL}/roles`] 
        || user?.['https://app.shop-next-door.com/roles'] 
        || "customer";

      // Store the role in cookies
      setCookie("userRole", userRole, {
        req,
        res,
        maxAge: 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      return result;
    } catch (error) {
      console.error('Auth0 callback error:', error);
      return res.status(error.status || 401).json({
        error: error.message || 'Authentication failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },
});
