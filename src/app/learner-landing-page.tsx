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

export default function LearnerLandingPage() {
  const { data: courses } = api.course.getAllPublished.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  return (
    <div className="py-5">
      <div className="font-semibold">Choose a course to get started.</div>
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
