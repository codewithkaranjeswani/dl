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
import CreateQuestionForm from "./create-question-form";

export default function EducatorQuizPage() {
  const currentPath = usePathname();
  const quizId = parseInt(currentPath.split("/").pop() ?? "0");
  const { data: quiz } = api.quiz.getMineById.useQuery(
    { quizId },
    { refetchOnWindowFocus: false },
  );
  const { data: questions } = api.question.getMineByQuizId.useQuery(
    { quizId },
    { refetchOnWindowFocus: false },
  );
  if (!quiz) {
    return null;
  }
  return (
    <div className="py-5">
      <div className="font-semibold">Your quiz preview</div>
      <div className="py-5" />
      <Card>
        <CardHeader className="font-semibold">{quiz.title}</CardHeader>
        <CardContent>{quiz.description}</CardContent>
        <CardFooter className="text-xs font-thin">
          {datefmt(quiz.createdAt)}
        </CardFooter>
      </Card>
      <div className="py-5" />
      <div className="font-semibold">Add questions to your quiz</div>
      <CreateQuestionForm quizId={quizId} />
      <div className="py-5" />
      <div className="">
        {questions?.map((question) => (
          <div key={`one-${question.id}`} className="">
            <Card>
              <CardHeader className="font-semibold">
                Question {question.order}
              </CardHeader>
              <CardContent>Q: {question.qtext}</CardContent>
              <CardContent>A: {question.atext}</CardContent>
              <CardContent>D: {question.description}</CardContent>
              <CardFooter className="text-xs font-thin">
                {datefmt(question.createdAt)}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
