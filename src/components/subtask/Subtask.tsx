import { useState, FC, useEffect } from 'react';
import clsx from 'clsx';
import { SubtaskType } from '../../utils/constants';
import './subtask.styles.css';

type SubtaskProps = {
  data: SubtaskType;
  changeSubtaskHandler: (subtask: SubtaskType) => void;
};

export const Subtask: FC<SubtaskProps> = ({ data, changeSubtaskHandler }) => {
  const [isChecked, setIsChecked] = useState<boolean>(data.checked);

  const handleIsChecked = () => {
    setIsChecked((prev) => !prev);
  };

  const classes = clsx('subtask', isChecked && 'subtask--checked');

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
};
