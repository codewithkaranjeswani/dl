"use client";
import { api } from "@/trpc/react";
import CreateCourseForm from "./create-course-form";

export default function EducatorLandingPage() {
  const { data: courses } = api.course.getMine.useQuery();

  return (
    <div className="py-5">
      <div className="font-semibold">Create a course and add quizes</div>
      <div className="py-5" />
      <div className="font-semibold">
        Create a course with Title and Description
      </div>
      <CreateCourseForm />
      <div className="font-semibold">
        Here are the list of courses you have created
      </div>
      <div className="py-5" />
      <div>
        {courses?.map((course) => (
          <div key={`one-${course.id}`}>
            <div key={`two-${course.id}`}>{course.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
