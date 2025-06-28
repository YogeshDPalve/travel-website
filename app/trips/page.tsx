import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const TripsPage = async () => {
  const session = await auth();
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Please Sign In.
      </div>
    );
  }
  return (
    <div className="space-y-6 container mx-auto px-4 py-8 ">
      <div className="">
        <h1>Dashboard</h1>
        <Link href={"/trips/new"}>
          <Button>New Trip</Button>
        </Link>
      </div>
    </div>
  );
};

export default TripsPage;
