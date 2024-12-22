import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Author {
    id: number;
    email: string;
    avatar?: string;
}

export interface Feedback {
    id: number;
    title: string;
    description: string;
    author: Author;
    createdAt: string;
    votes: number;
    categoryId: number;
    statusId: number;
}

export interface CreateFeedbackData {
    title: string;
    description: string;
    categoryId: string;
    statusId: string;
}

export interface FeedbacksResponse {
    posts: Feedback[];
    pagination: {
        total: number;
        pages: number;
        currentPage: number;
    };
}

const getAuthHeader = () => ({
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }
});

export const feedbackService = {
    async getFeedbacks(params: any = {}): Promise<FeedbacksResponse> {
        try {
            const response = await axios.get(`${API_URL}/feedback`, {
                params,
                ...getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            return { posts: [], pagination: { total: 0, pages: 0, currentPage: 1 } };
        }
    },

    async createFeedback(data: CreateFeedbackData): Promise<Feedback> {
        try {
            // Преобразуем строковые ID в числа
            const formattedData = {
                ...data,
                categoryId: parseInt(data.categoryId),
                statusId: parseInt(data.statusId)
            };

            const response = await axios.post(
                `${API_URL}/feedback`,
                formattedData,
                getAuthHeader()
            );
            return response.data;
        } catch (error) {
            console.error('Error creating feedback:', error);
            throw error;
        }
    },

    async updateFeedback(id: number, data: CreateFeedbackData): Promise<Feedback> {
        try {
            const formattedData = {
                ...data,
                categoryId: parseInt(data.categoryId),
                statusId: parseInt(data.statusId)
            };

            const response = await axios.put(
                `${API_URL}/feedback/${id}`,
                formattedData,
                getAuthHeader()
            );
            return response.data;
        } catch (error) {
            console.error('Error updating feedback:', error);
            throw error;
        }
    },

    async deleteFeedback(id: number): Promise<void> {
        try {
            await axios.delete(
                `${API_URL}/feedback/${id}`,
                getAuthHeader()
            );
        } catch (error) {
            console.error('Error deleting feedback:', error);
            throw error;
        }
    },

    async toggleVote(postId: number): Promise<void> {
        try {
            await axios.post(
                `${API_URL}/feedback/${postId}/vote`,
                {},
                getAuthHeader()
            );
        } catch (error) {
            console.error('Error toggling vote:', error);
            throw error;
        }
    }
};