import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useFeedback } from '../../../hooks/useFeedback';
import FeedbackCard from './FeedbackCard';
import CreateFeedbackModal from './CreateFeedbackModal';
import FeedbackModal from './FeedbackModal';
import { Feedback, CreateFeedbackData } from '../../../services/feedbackService';

const SORT_OPTIONS = [
    { id: 'trending', label: 'Trending' },
    { id: 'most-voted', label: 'Most voted' },
    { id: 'newest', label: 'Newest' },
];

const CATEGORIES = [
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'trending', label: 'Trending' },
    { id: 'most-voted', label: 'Most voted' },
    { id: 'newest', label: 'Newest' },
];

const FeedbackList = () => {
    const { feedbacks, loading, toggleVote, createFeedback } = useFeedback();
    const [selectedSort, setSelectedSort] = useState('trending');
    const [selectedCategory, setSelectedCategory] = useState('trending');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleCreateFeedback = async (data: CreateFeedbackData) => {
        await createFeedback(data);
        setIsCreateModalOpen(false);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-6 mb-6">
                <h1 className="text-2xl font-bold mb-2">Test</h1>
                <p className="text-gray-600">
                    Let us know how we can improve. Vote on existing ideas or suggest new ones.
                </p>
            </div>

            <div className="flex gap-6">
                {/* Sidebar */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`w-full text-left px-3 py-2 rounded-md ${
                                    selectedCategory === category.id
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-sm mb-6">
                        <div className="p-4 flex items-center justify-between border-b">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border rounded-md w-64"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <select
                                    value={selectedSort}
                                    onChange={(e) => setSelectedSort(e.target.value)}
                                    className="border rounded-md px-3 py-2"
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                <Button onClick={() => setIsCreateModalOpen(true)}>
                                    Make a suggestion
                                </Button>
                            </div>
                        </div>

                        {/* Feedback list */}
                        <div className="divide-y">
                            {loading ? (
                                <div className="p-4 text-center">Loading...</div>
                            ) : feedbacks.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">No feedback found</div>
                            ) : (
                                feedbacks.map((feedback, index) => (
                                    <FeedbackCard
                                        key={feedback.id}
                                        {...feedback}
                                        number={index + 1}
                                        onVote={() => toggleVote(feedback.id)}
                                        onClick={() => setSelectedFeedback(feedback)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CreateFeedbackModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateFeedback}
            />

            {selectedFeedback && (
                <FeedbackModal
                    feedback={selectedFeedback}
                    isOpen={!!selectedFeedback}
                    onClose={() => setSelectedFeedback(null)}
                    onVote={() => toggleVote(selectedFeedback.id)}
                />
            )}
        </div>
    );
};

export default FeedbackList;