import { useState, useEffect } from 'react';
import { feedbackService, Feedback, CreateFeedbackData } from '../services/feedbackService';
import { useToast } from './use-toast';

export const useFeedback = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await feedbackService.getFeedbacks();
            setFeedbacks(response.posts);
            setError(null);
        } catch (err) {
            console.error('Error fetching feedbacks:', err);
            setError('Failed to load feedbacks');
            toast({
                title: 'Error',
                description: 'Failed to load feedbacks',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const createFeedback = async (data: CreateFeedbackData) => {
        try {
            const response = await feedbackService.createFeedback(data);
            setFeedbacks(prev => [response, ...prev]);
            toast({
                title: 'Success',
                description: 'Feedback created successfully',
            });
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to create feedback';
            console.error('Error creating feedback:', error);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
            throw error;
        }
    };

    const toggleVote = async (feedbackId: number) => {
        try {
            await feedbackService.toggleVote(feedbackId);
            await fetchFeedbacks(); // Обновляем список после голосования
        } catch (error) {
            console.error('Error toggling vote:', error);
            toast({
                title: 'Error',
                description: 'Failed to vote',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return {
        feedbacks,
        loading,
        error,
        fetchFeedbacks,
        createFeedback,
        toggleVote,
    };
};