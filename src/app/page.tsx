import { getServerAuthSession } from "@/server/auth";
import CustomLandingPage from "./custom-landing-page";
import LandingPage from "./landing-page";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <div>
      {!session ? <LandingPage /> : <CustomLandingPage session={session} />}
    </div>
  );
}
