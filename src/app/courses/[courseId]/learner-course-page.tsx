"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { datefmt } from "@/lib/utils";
import { api } from "@/trpc/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LearnerCoursePage() {
  const currentPath = usePathname();
  const courseId = parseInt(currentPath.split("/").pop() ?? "0");
  const { data: course } = api.course.getByIdPublished.useQuery(
    { courseId },
    { refetchOnWindowFocus: false },
  );
  if (!course) {
    return null;
  }
  return (
    <div className="py-5">
      <div className="font-semibold">Your course progress</div>
      <div className="py-5" />
      <Card>
        <CardHeader className="font-semibold">{course.title}</CardHeader>
        <CardContent>{course.description}</CardContent>
        <CardFooter className="text-xs font-thin">
          {datefmt(course.createdAt)}
        </CardFooter>
      </Card>
      <div className="py-5" />
      <div className="font-semibold">Quizes available within the course</div>
      <div className="py-5" />
      <div className="flex flex-col gap-y-5 ">
        {course.quizes?.map((quiz) => (
          <div key={`one-${quiz.id}`} className="">
            <Link href={`/courses/${courseId}/quizes/${quiz.id}`}>
              <Card>
                <CardHeader className="font-semibold">{quiz.title}</CardHeader>
                <CardContent>{quiz.description}</CardContent>
                <CardFooter className="text-xs font-thin">
                  {datefmt(quiz.createdAt)}
                </CardFooter>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
