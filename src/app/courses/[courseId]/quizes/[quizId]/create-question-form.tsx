"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ZQuesCreate, TQuesCreate } from "@/lib/types";
import { api } from "@/trpc/react";

export default function CreateQuestionForm({ quizId }: { quizId: number }) {
  const ctx = api.useUtils();
  const createQues = api.question.create.useMutation({
    onSuccess: async () => {
      await ctx.question.getMineByQuizId.invalidate();
    },
  });

  const form = useForm<TQuesCreate>({
    resolver: zodResolver(ZQuesCreate),
    defaultValues: {
      qtext: "",
      atext: "",
      order: -1,
      description: "",
      quizId: quizId,
    },
  });

  function onSubmit(values: TQuesCreate) {
    createQues.mutate(values);
    form.reset();
  }

  return (
    <>
      <div className="py-5" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="qtext"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Which continent has the thickest layer of ice"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is the quiz question</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="atext"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer</FormLabel>
                <FormControl>
                  <Input placeholder="Antarctica" {...field} />
                </FormControl>
                <FormDescription>
                  This is the expected answer to the quiz question
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} />
                </FormControl>
                <FormDescription>
                  This is the ordering of the qustion in the quiz (1 to n)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Fun Fact: Antarctica also has land below the ice"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is the description about the question (users will see
                  this after they answer)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="py-5" />
    </>
  );
}
