import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import * as z from 'zod';

const userShema = z.object({
  username: z.string().min(1, 'Username is required').max(100, 'Username should be less than 100 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be minimum 8 characters long'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password } = userShema.parse(body);

    // Check if the user email already exists
    const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingUserByEmail) {
      return NextResponse.json(
        {
          message: 'User with this email already exists',
        },
        { status: 400 }
      );
    }
    // Check if the username already exists
    const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUserByUsername) {
      return NextResponse.json(
        {
          message: 'User with this username already exists',
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const { password: userPassword, ...restUser } = newUser;

    return NextResponse.json(
      {
        user: restUser,
        message: 'User created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Something went wrong',
      },
      { status: 500 }
    );
  }
}
