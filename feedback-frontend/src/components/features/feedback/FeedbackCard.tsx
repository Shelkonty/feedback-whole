import React from 'react';
import { ChevronUp } from 'lucide-react';

interface Author {
    id: number;
    email: string;
    avatar?: string;
}

export interface FeedbackCardProps {
    id: number;
    title: string;
    description: string;
    author: Author;
    createdAt: string;
    votes: number;
    number: number;
    categoryId: number;
    statusId: number;
    onVote: () => void;
    onClick: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
                                                       title,
                                                       description,
                                                       votes,
                                                       number,
                                                       onVote,
                                                       onClick
                                                   }) => {
    return (
        <div className="p-4 hover:bg-gray-50 cursor-pointer" onClick={onClick}>
            <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onVote();
                        }}
                        className="flex flex-col items-center p-2 rounded-md hover:bg-gray-100"
                    >
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">{votes}</span>
                    </button>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-900">
                            {title}
                        </h3>
                        <span className="text-xs text-gray-500">#{number}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeedbackCard;