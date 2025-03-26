// app/api/users/[userId]/route.ts
import User from "@/models/user.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  await connect_DB();
  const { userId } = params;

  // Parse the request body
  const updates = await request.json();

  // Only allow updating these fields
  const allowedUpdates = ["username", "email", "bio", "avatar"];
  const filteredUpdates: Partial<Record<string, string>> = {};

  for (const key of allowedUpdates) {
    if (key in updates) {
      filteredUpdates[key] = updates[key];
    }
  }

  try {
    // Update the user document with the filtered fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User details updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
