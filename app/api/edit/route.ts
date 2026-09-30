import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

const usernamePattern = /^[A-Za-z0-9_]{3,20}$/;

export async function PUT(request: Request) {
  try {
    const body: unknown = await request.json();

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const { username, currentPassword, newPassword } = body as Record<
      string,
      unknown
    >;

    if (
      typeof username !== 'string' ||
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Username and all password fields are required.' },
        { status: 400 },
      );
    }

    const cleanUsername = username.trim();

    if (!usernamePattern.test(cleanUsername)) {
      return NextResponse.json(
        { error: 'Enter a valid username.' },
        { status: 400 },
      );
    }

    if (!currentPassword || newPassword.length < 6) {
      return NextResponse.json(
        {
          error:
            'Enter your current password and a new password of at least 6 characters.',
        },
        { status: 400 },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'Choose a password different from your current one.' },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const users = db.collection('users');

    // TODO(auth): Once login issues signed tokens, verify the token here and
    // identify the user from its trusted claims instead of request credentials.
    const user = await users.findOne({
      usernameLower: cleanUsername.toLowerCase(),
    });

    if (
      !user ||
      typeof user.passwordHash !== 'string' ||
      !(await bcrypt.compare(currentPassword, user.passwordHash))
    ) {
      return NextResponse.json(
        { error: 'Username or current password is incorrect.' },
        { status: 401 },
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordHash,
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'Unable to update password right now.' },
      { status: 500 },
    );
  }
}
