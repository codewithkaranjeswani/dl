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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { TQues } from "@/lib/types";
import { datefmt } from "@/lib/utils";
import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";
import { z } from "zod";
import { useState } from "react";

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

const ZAns = z.object({ atext: z.string() });
type TAns = z.infer<typeof ZAns>;

function QuestionOnCarouselItem({ question }: { question: TQues }) {
  const { toast } = useToast();
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const checkAns = api.question.checkAnswerById.useMutation({
    onSuccess: async (data) => {
      if (data) {
        toast({
          variant: "default",
          title: "Correct Answer",
          description: "Continue to the next question!",
        });
        setDisableForm(true);
      } else {
        toast({
          variant: "destructive",
          title: "Incorrect Answer",
          description: "Try Again",
        });
      }
    },
  });
  const form = useForm<TAns>({
    resolver: zodResolver(ZAns),
    defaultValues: {
      atext: "",
    },
  });

  function onSubmit(values: TAns) {
    if (!disableForm) {
      checkAns.mutate({
        questionId: question.id,
        atext: values.atext,
      });
      form.reset();
    }
  }
  return (
    <CarouselItem key={`car-${question.id}`}>
      <div key={`one-${question.id}`} className="flex flex-col gap-y-2 px-2 ">
        <Card>
          <CardHeader className="font-semibold">
            Question {question.order}
          </CardHeader>
          <CardContent>Q: {question.qtext}</CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="atext"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Answer here"
                      {...field}
                      disabled={disableForm}
                    />
                  </FormControl>
                  <FormDescription>Type Answer here</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant={"outline"} disabled={disableForm}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </CarouselItem>
  );
}
