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
import { ZQuizCreate, type TQuizCreate } from "@/lib/types";
import { api } from "@/trpc/react";

export default function CreateQuizForm({ courseId }: { courseId: number }) {
  const ctx = api.useUtils();
  const createQuiz = api.quiz.create.useMutation({
    onSuccess: async () => {
      await ctx.quiz.getMineByCourseId.invalidate();
    },
  });

  const form = useForm<TQuizCreate>({
    resolver: zodResolver(ZQuizCreate),
    defaultValues: {
      title: "",
      description: "",
      courseId: courseId,
    },
  });

  function onSubmit(values: TQuizCreate) {
    createQuiz.mutate(values);
    form.reset();
  }

  return (
    <>
      <div className="py-5" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Calculus" {...field} />
                </FormControl>
                <FormDescription>This is your quiz title</FormDescription>
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
                  <Input placeholder="Problems of caculus" {...field} />
                </FormControl>
                <FormDescription>This is your quiz description</FormDescription>
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
