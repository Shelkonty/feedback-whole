import {Request, RequestHandler, Response} from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FeedbackInput {
    title: string;
    description: string;
    categoryId: string;
    statusId: string;
}

interface FeedbackQuery {
    page?: string;
    limit?: string;
    categoryId?: string;
    statusId?: string;
    sortBy?: string;
}

interface RequestWithUser extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export const createFeedback: (req: any, res: any) => Promise<Response<any, Record<string, any>>> = async (req, res) => {
    try {
        const { title, description, categoryId, statusId } = req.body;
        const authorId = req.user?.userId;

        if (!title || !description || !categoryId || !statusId) {
            return res.status(400).json({
                error: 'Validation error',
                details: 'All fields are required'
            });
        }

        // Проверяем существование категории и статуса
        const [category, status] = await Promise.all([
            prisma.category.findUnique({ where: { id: parseInt(categoryId) } }),
            prisma.status.findUnique({ where: { id: parseInt(statusId) } })
        ]);

        if (!category) {
            return res.status(400).json({
                error: 'Validation error',
                details: 'Category not found'
            });
        }

        if (!status) {
            return res.status(400).json({
                error: 'Validation error',
                details: 'Status not found'
            });
        }

        const post = await prisma.post.create({
            data: {
                title,
                description,
                authorId: authorId!,
                categoryId: parseInt(categoryId),
                statusId: parseInt(statusId)
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        avatar: true
                    }
                },
                category: true,
                status: true,
                _count: {
                    select: { votes: true }
                }
            }
        });

        res.status(201).json(post);
    } catch (error) {
        console.error('Create feedback error:', error);
        res.status(500).json({
            error: 'Error creating feedback',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getFeedbacks = async (
    req: RequestWithUser,
    res: Response
): Promise<void> => {
    try {
        const {
            page = '1',
            limit = '10',
            categoryId,
            statusId,
            sortBy = 'createdAt'
        } = req.query as FeedbackQuery;

        const userId = req.user?.userId;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where: any = {};
        if (categoryId) where.categoryId = parseInt(categoryId);
        if (statusId) where.statusId = parseInt(statusId);

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: sortBy === 'votes'
                    ? { votes: { _count: 'desc' } }
                    : { createdAt: 'desc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            avatar: true
                        }
                    },
                    category: true,
                    status: true,
                    votes: userId ? {
                        where: { userId }
                    } : false,
                    _count: {
                        select: { votes: true }
                    }
                }
            }),
            prisma.post.count({ where })
        ]);

        const formattedPosts = posts.map(post => ({
            ...post,
            votes: post._count.votes,
            hasVoted: userId ? post.votes.length > 0 : false
        }));

        res.json({
            posts: formattedPosts,
            pagination: {
                total,
                pages: Math.ceil(total / parseInt(limit)),
                currentPage: parseInt(page)
            }
        });
    } catch (error) {
        console.error('Error getting feedbacks:', error);
        res.status(500).json({
            error: 'Error getting feedbacks',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

interface UpdateParams {
    id: string;
}

export const updateFeedback = async (
    req: RequestWithUser,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params as unknown as UpdateParams;
        const { title, description, categoryId, statusId } = req.body as FeedbackInput;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) }
        });

        if (!post) {
            res.status(404).json({ error: 'Feedback not found' });
            return;
        }

        if (post.authorId !== userId) {
            res.status(403).json({ error: 'Not authorized to edit this feedback' });
            return;
        }

        const updatedPost = await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                categoryId: parseInt(categoryId),
                statusId: parseInt(statusId)
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        avatar: true
                    }
                },
                category: true,
                status: true,
                _count: {
                    select: { votes: true }
                }
            }
        });

        res.json(updatedPost);
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({
            error: 'Error updating feedback',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const deleteFeedback = async (
    req: RequestWithUser,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params as unknown as UpdateParams;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) }
        });

        if (!post) {
            res.status(404).json({ error: 'Feedback not found' });
            return;
        }

        if (post.authorId !== userId) {
            res.status(403).json({ error: 'Not authorized to delete this feedback' });
            return;
        }

        await prisma.post.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({
            error: 'Error deleting feedback',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};