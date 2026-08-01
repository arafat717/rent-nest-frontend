/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUser } from "@/redux/features/authSlice";

import { useUpdateProfileMutation } from "@/redux/api/userApi";
import { ProfileFormValues, profileSchema } from "@/src/types/profile";

export function ProfileInfoForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      avatar: user?.avatar ?? "",
    },
  });

  const avatarPreview = form.watch("avatar");

  const onSubmit = async (values: ProfileFormValues) => {
    const toastId = toast.loading("Updating your profile...");

    try {
      const res = await updateProfile({
        ...values,
        avatar: values.avatar || undefined,
      }).unwrap();

      dispatch(updateUser(res.data));
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Couldn't update profile. Please try again.",
        { id: toastId },
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarPreview || undefined} />
            <AvatarFallback className="text-lg">
              {user?.name?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/photo.jpg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input value={user?.email ?? ""} disabled />
          </FormControl>
          <FormDescription>
            Email can&apos;t be changed. Contact support if you need to update
            it.
          </FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+880 1XXX-XXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
