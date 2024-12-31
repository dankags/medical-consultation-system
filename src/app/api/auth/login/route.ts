import { NextApiRequest, NextApiResponse } from 'next';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { getUserFromDatabase } from '@/lib/database'; // Assume you have a function to get user data from your database
import { setCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const res=await clerkClient
        const user = await getUserFromDatabase(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const session = await sessions.getSession(req);
        const sessionExpiry = new Date(session.expiresAt);

        const userCookie = {
            name: user.name,
            number: user.number,
            role: user.role,
            email: user.email,
        };

        setCookie('user', JSON.stringify(userCookie), {
            req,
            res,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: sessionExpiry,
            path: '/',
        });

        return res.status(200).json({ message: 'Login successful' });
    } catch (error:any) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
