import React, { useState } from 'react';
import { Send, ThumbsUp } from 'lucide-react';
import { Button } from '../../ui/Button';
import Modal from '../../ui/Modal';
import { formatDate } from '../../../utils/helper';

interface Author {
    id: number;
    email: string;
    avatar?: string;
}

interface Feedback {
    id: number;
    title: string;
    description: string;
    author: Author;
    createdAt: string;
    votes: number;
}

interface FeedbackModalProps {
    feedback: Feedback;
    isOpen: boolean;
    onClose: () => void;
    onVote: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
                                                         feedback,
                                                         isOpen,
                                                         onClose,
                                                         onVote
                                                     }) => {
    const [comment, setComment] = useState('');

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        // Здесь будет логика отправки комментария
        console.log('Submit comment:', comment);
        setComment('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={feedback.title}
        >
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        {feedback.author.avatar ? (
                            <img
                                src={feedback.author.avatar}
                                alt={feedback.author.email}
                                className="w-10 h-10 rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {feedback.author.email[0].toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium">{feedback.author.email}</h3>
                                <p className="text-sm text-gray-500">{formatDate(feedback.createdAt)}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onVote}
                                className="flex items-center gap-2"
                            >
                                <ThumbsUp className="w-4 h-4" />
                                {feedback.votes}
                            </Button>
                        </div>

                        <p className="mt-2 text-gray-700">{feedback.description}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmitComment} className="mt-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Button type="submit" disabled={!comment.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default FeedbackModal;