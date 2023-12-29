import { getServerAuthSession } from "@/server/auth";
import CustomLandingPage from "./custom-landing-page";
import LandingPage from "./landing-page";
import { unstable_noStore as noStore } from "next/cache";

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();
  return (
    <>{!session ? <LandingPage /> : <CustomLandingPage session={session} />}</>
  );
}
