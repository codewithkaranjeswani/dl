"use client";
import { api } from "@/trpc/react";
import CreateCourseForm from "./create-course-form";

// TODO:
// make the courses clickable to go to course page
// each course page should have a form to create quizes
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
        Here are the list of courses you have created. Only the latest will be
        shown to learners.
      </div>
      <div className="border-b py-5" />
      <div className="border-b">
        {courses?.map((course) => (
          <div key={`one-${course.id}`}>
            <div key={`two-${course.id}`}>{course.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
