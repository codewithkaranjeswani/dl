import { USER_ROLE } from "@/lib/types";
import { getServerAuthSession } from "@/server/auth";
import { unstable_noStore as noStore } from "next/cache";
import LearnerCoursePage from "./learner-course-page";
import EducatorCoursePage from "./educator-course-page";

export default async function CoursePage() {
  noStore();
  const session = await getServerAuthSession();
  if (!session) {
    return null;
  }
  const role = session.user.role;
  const learnerAccess = role === USER_ROLE.USER;
  const educatorAccess =
    role === USER_ROLE.EDUCATOR || role === USER_ROLE.ADMIN;
  if (learnerAccess) {
    return <LearnerCoursePage />;
  } else if (educatorAccess) {
    return <EducatorCoursePage />;
  } else {
    return (
      <>
        Expected role to be among{" "}
        {(USER_ROLE.ADMIN, USER_ROLE.EDUCATOR, USER_ROLE.USER)}, got {role}
      </>
    );
  }
}
