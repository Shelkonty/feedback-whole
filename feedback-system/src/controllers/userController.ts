import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface RegisterInput {
    email: string;
    password: string;
    avatar?: string;
}

interface LoginInput {
    email: string;
    password: string;
}

export const register = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response
): Promise<void> => {
    try {
        const { email, password, avatar } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(400).json({ error: 'Email уже зарегистрирован' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                avatar
            }
        });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Ошибка при регистрации',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};

export const login = async (
    req: Request<{}, {}, LoginInput>,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(401).json({ error: 'Неверный email или пароль' });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ error: 'Неверный email или пароль' });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при входе' });
    }
};

export const getProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                avatar: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            res.status(404).json({ error: 'Пользователь не найден' });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении профиля' });
    }
};