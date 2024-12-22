import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const category = await prisma.category.create({
            data: { name }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании категории' });
    }
};

export const getCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении категорий' });
    }
};

export const getStatuses = async (_req: Request, res: Response) => {
    try {
        const statuses = await prisma.status.findMany();
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении статусов' });
    }
};