import { handleAuth, handleProfile } from "@auth0/nextjs-auth0";

export default handleAuth({
  profile: handleProfile(),
});
