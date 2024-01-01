"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { TQues } from "@/lib/types";
import { datefmt } from "@/lib/utils";
import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

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
      <Carousel>
        <CarouselContent>
          {quiz.questions?.map((question) => (
            <QuestionOnCarouselItem key={question.id} question={question} />
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

function QuestionOnCarouselItem({ question }: { question: TQues }) {
  const [ans, setAns] = useState<boolean>();
  const checkAns = api.question.checkAnswerById.useMutation({
    onSuccess: async (data) => {
      setAns(data);
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  console.log(ans);
  return (
    <CarouselItem key={`car-${question.id}`}>
      <div key={`one-${question.id}`} className="flex flex-col gap-y-2 px-2 ">
        <Card>
          <CardHeader className="font-semibold">
            Question {question.order}
          </CardHeader>
          <CardContent>Q: {question.qtext}</CardContent>
        </Card>
        <Input type="text" placeholder="Answer here" ref={inputRef} />
        <Button
          type="submit"
          variant={"outline"}
          onClick={(e) => {
            e.preventDefault();
            if (!!inputRef.current) {
              const atext = inputRef.current.value;
              checkAns.mutate({
                questionId: question.id,
                atext: atext,
              });
            }
          }}
        >
          Submit
        </Button>
      </div>
    </CarouselItem>
  );
}
