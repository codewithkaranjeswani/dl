"use client";
import { api } from "@/trpc/react";
import CreateCourseForm from "./create-course-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { datefmt } from "@/lib/utils";
import Link from "next/link";

export default function EducatorLandingPage() {
  const { data: courses } = api.course.getMine.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="py-5">
      <div className="font-semibold">Create a course and add quizes</div>
      <div className="py-5" />
      <div className="font-semibold">
        Create a course with Title and Description
      </div>
      <CreateCourseForm />
      <div className="font-semibold">
        Here are the list of courses you have created. Only the latest will be
        shown to learners.
      </div>
      <div className="py-5" />
      <div className="grid gap-5 md:grid-cols-3">
        {courses?.map((course) => (
          <div key={`one-${course.id}`} className="">
            <Link href={`/courses/${course.id}`}>
              <Card>
                <CardHeader className="font-semibold">
                  {course.title}
                </CardHeader>
                <CardContent>{course.description}</CardContent>
                <CardFooter className="text-xs font-thin">
                  {datefmt(course.createdAt)}
                </CardFooter>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
