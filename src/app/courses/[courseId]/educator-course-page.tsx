"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { datefmt } from "@/lib/utils";
import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";
import CreateQuizForm from "./create-quiz-form";
import Link from "next/link";

export default function EducatorCoursePage() {
  const currentPath = usePathname();
  const courseId = parseInt(currentPath.split("/").pop() ?? "0");
  const { data: course } = api.course.getMineById.useQuery(
    { courseId },
    { refetchOnWindowFocus: false },
  );
  const { data: quizes } = api.quiz.getMineByCourseId.useQuery(
    { courseId: courseId },
    { refetchOnWindowFocus: false },
  );

  if (!course) {
    return null;
  }
  return (
    <div className="py-5">
      <div className="font-semibold">Your course preview</div>
      <div className="py-5" />
      <Card>
        <CardHeader className="font-semibold">{course.title}</CardHeader>
        <CardContent>{course.description}</CardContent>
        <CardFooter className="text-xs font-thin">
          {datefmt(course.createdAt)}
        </CardFooter>
      </Card>
      <div className="py-5" />
      <div className="font-semibold">Create a quiz and add questions</div>
      <CreateQuizForm courseId={courseId} />
      <div className="font-semibold">
        Here are the list of quizes you have created for this course.
      </div>
      <div className="py-5" />
      <div className="grid gap-5 md:grid-cols-3">
        {quizes?.map((quiz) => (
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
