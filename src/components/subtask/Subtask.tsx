import { useState, FC, useEffect, memo } from 'react';
import clsx from 'clsx';
import { SubtaskType } from '../../utils/constants';
import './subtask.styles.css';

type SubtaskProps = {
	data: SubtaskType;
	changeSubtaskHandler: (subtask: SubtaskType) => void;
	mod?: string;
};

// Memoize the Subtask component to prevent unnecessary re-renders
const SubtaskComponent: FC<SubtaskProps> = memo(
	({ data, changeSubtaskHandler, mod }) => {
		const [isChecked, setIsChecked] = useState<boolean>(data.checked);

		const handleIsChecked = () => {
			setIsChecked((prev) => !prev);
		};

		const classes = clsx(
			'subtask',
			isChecked && 'subtask--checked',
			mod && `subtask--${mod}`
		);

		useEffect(() => {
			// Проверяем, изменилось ли состояние isChecked
			if (isChecked !== data.checked) {
				const updatedSubtask = { ...data, checked: isChecked };
				changeSubtaskHandler(updatedSubtask);
			}
		}, [isChecked, changeSubtaskHandler, data]);

		return (
			<li className={classes} id={data.id} onClick={handleIsChecked}>
				{data.value}
			</li>
		);
	}
);

// Export the memoized component
export const Subtask = SubtaskComponent;
