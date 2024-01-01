"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { datefmt } from "@/lib/utils";
import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";

export default function LearnerQuizPage() {
  const currentPath = usePathname();
  const quizId = parseInt(currentPath.split("/").pop() ?? "0");
  const { data: quiz } = api.quiz.getByIdWithQuestions.useQuery(
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
      <div className="flex flex-col gap-y-5">
        {quiz.questions?.map((question) => (
          <div key={`one-${question.id}`} className="flex flex-col gap-y-2">
            <Card>
              <CardHeader className="font-semibold">
                Question {question.order}
              </CardHeader>
              <CardContent>Q: {question.qtext}</CardContent>
            </Card>
            <Input type="text" placeholder="Answer here" />
            <Button
              type="submit"
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Submit
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
