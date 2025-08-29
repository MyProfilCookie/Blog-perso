import React from 'react';
import { Button } from '@nextui-org/react';

interface RatingButtonsProps {
  exerciseId: string;
  onRating: (exerciseId: string, value: number) => void;
}

const RatingButtons: React.FC<RatingButtonsProps> = React.memo(({ exerciseId, onRating }) => {
  const handleRating = React.useCallback((value: number) => {
    onRating(exerciseId, value);
  }, [exerciseId, onRating]);

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Noter la difficulté de cet exercice :
      </p>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            size="lg"
            color="default"
            variant="flat"
            onClick={() => handleRating(value)}
            className="w-full h-12 sm:h-10 flex items-center justify-center text-lg"
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
});

RatingButtons.displayName = 'RatingButtons';

export default RatingButtons;