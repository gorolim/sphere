import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = process.env.JWT_SECRET || 'engine-sphere-super-secret-native-key-3918';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

export async function signToken(payload: { userId: string }): Promise<string> {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function getSessionUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('engine_session')?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    return payload ? payload.userId : null;
}

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('engine_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('engine_session');
}
