import { type Session } from "next-auth";

export default function CustomLandingPage({ session }: { session: Session }) {
  return <div>Logged in as {session.user.email}</div>;
}
