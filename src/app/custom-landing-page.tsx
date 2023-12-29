import { USER_ROLE } from "@/lib/types";
import { type Session } from "next-auth";
import LearnerLandingPage from "./learner-landing-page";
import EducatorLandingPage from "./educator-landing-page";

export default function CustomLandingPage({ session }: { session: Session }) {
  const role = session.user.role;
  const learnerAccess = role === USER_ROLE.USER;
  const educatorAccess =
    role === USER_ROLE.EDUCATOR || role === USER_ROLE.ADMIN;
  if (learnerAccess) {
    return <LearnerLandingPage />;
  } else if (educatorAccess) {
    return <EducatorLandingPage />;
  } else {
    return (
      <>
        Expected role to be among{" "}
        {(USER_ROLE.ADMIN, USER_ROLE.EDUCATOR, USER_ROLE.USER)}, got {role}
      </>
    );
  }
}
