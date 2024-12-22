interface FilterOption {
    id: string;
    label: string;
}

interface FeedbackFiltersProps {
    selected: string;
    onChange: (value: string) => void;
    options: FilterOption[];
}

export const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
                                                                    selected,
                                                                    onChange,
                                                                    options,
                                                                }) => {
    return (
        <div className="space-y-2">
            {options.map((option) => (
                <button
                    key={option.id}
                    className={`
            w-full text-left px-3 py-2 rounded transition-colors
            ${selected === option.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'hover:bg-gray-50'
                    }
          `}
                    onClick={() => onChange(option.id)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};