// app/api/signin/route.ts
import User from "@/models/user.model";
import { connect_DB } from "@/utils/DB";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Connect to MongoDB
  await connect_DB();

  // Parse the request body
  const { google_id, email, name, image } = await request.json();

  try {
    // Check if the user already exists by oauthId (from Google)
    const existingUser = await User.findOne({ oauthId: google_id });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", user_id: existingUser._id },
        { status: 200 }
      );
    }

    // Create a new user
    const newUser = await User.create({
      username: name,
      email,
      oauthProvider: "google",
      oauthId: google_id,
      avatar: image || "",
    });

    return NextResponse.json(
      { message: "User created", user_id: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during sign in:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
