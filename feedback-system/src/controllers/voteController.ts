import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const toggleVote = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.userId;

        // Проверяем существующий голос
        const existingVote = await prisma.vote.findUnique({
            where: {
                userId_postId: {
                    userId: userId!,
                    postId: parseInt(postId)
                }
            }
        });

        if (existingVote) {
            // Если голос существует - удаляем его
            await prisma.vote.delete({
                where: {
                    userId_postId: {
                        userId: userId!,
                        postId: parseInt(postId)
                    }
                }
            });
            res.json({ message: 'Голос снят' });
        } else {
            // Если голоса нет - создаем новый
            await prisma.vote.create({
                data: {
                    userId: userId!,
                    postId: parseInt(postId)
                }
            });
            res.json({ message: 'Голос учтен' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при голосовании' });
    }
};