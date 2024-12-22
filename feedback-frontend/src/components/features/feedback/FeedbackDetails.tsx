import React, { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import {Button} from '../../ui/Button.tsx';
import Avatar from '../../ui/Avatar';
import { formatDate } from '../../../utils/helper';

interface FeedbackDetailsProps {
    feedback: {
        id: number;
        title: string;
        description: string;
        author: {
            email: string;
            avatar?: string;
        };
        createdAt: string;
        votes: number;
    };
    onVote: () => void;
}

const FeedbackDetails = ({ feedback, onVote }: FeedbackDetailsProps) => {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setIsSubmitting(true);
        try {
            // Здесь будет логика отправки комментария
            // await feedbackService.addComment(feedback.id, comment);
            setComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-4">
                <Avatar
                    src={feedback.author.avatar}
                    alt={feedback.author.email}
                    className="w-10 h-10"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">
                                {feedback.author.email}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {formatDate(feedback.createdAt)}
                            </p>
                        </div>
                        <button
                            onClick={onVote}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <span className="mr-2">👍</span>
                            {feedback.votes}
                        </button>
                    </div>
                    <div className="mt-2">
                        <p className="text-gray-900">{feedback.description}</p>
                    </div>
                </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mt-6">
                <div className="flex items-start space-x-4">
                    <div className="min-w-0 flex-1">
                        <div className="border border-gray-300 rounded-lg shadow-sm">
              <textarea
                  rows={3}
                  name="comment"
                  id="comment"
                  className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  placeholder="Leave a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
              />
                            <div className="border-t border-gray-300 px-3 py-2 flex justify-between items-center">
                                <button
                                    type="button"
                                    className="inline-flex items-center text-gray-500 hover:text-gray-600"
                                >
                                    <Paperclip className="w-5 h-5 mr-2" />
                                    Attach
                                </button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !comment.trim()}
                                    size="sm"
                                    className="inline-flex items-center"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FeedbackDetails;