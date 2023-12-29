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
import { ZCourseCreate, type TCourseCreate } from "@/lib/types";
import { api } from "@/trpc/react";

export default function CreateCourseForm() {
  const ctx = api.useUtils();
  const createCourse = api.course.create.useMutation({
    onSuccess: async () => {
      await ctx.course.getMine.invalidate();
    },
  });

  const form = useForm<TCourseCreate>({
    resolver: zodResolver(ZCourseCreate),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: TCourseCreate) {
    createCourse.mutate(values);
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
                  <Input placeholder="Physics" {...field} />
                </FormControl>
                <FormDescription>This is your course title</FormDescription>
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
                    placeholder="Problems and Solutions for Physics Class X"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your course description
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
