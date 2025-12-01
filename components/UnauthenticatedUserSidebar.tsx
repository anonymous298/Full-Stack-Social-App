import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const UnauthenticatedUserSidebar = () => {
  return (
    <Card className="w-full sticky top-20">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">Welcome Back!</CardTitle>
        <CardDescription className="text-center text-muted-foreground mb-4">Login to access your profile and connect with others.</CardDescription>
      </CardHeader>

      <CardFooter className="flex-col gap-2">
        <SignInButton mode="modal">
            <Button variant={'outline'} className="w-full">Login</Button>
        </SignInButton>

        <SignUpButton mode="modal">
            <Button className="w-full">Sign Up</Button>
        </SignUpButton>
      </CardFooter>
    </Card>
  );
};

export default UnauthenticatedUserSidebar;


