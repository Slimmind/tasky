import { TaskType } from '../../utils/constants';
import './estimation.styles.css';

type EstimationProps = {
	task: TaskType;
};

import { useEffect, useState } from 'react';
// import { PlayIcon } from '../../../icons/icon-play';
// import { PauseIcon } from '../../../icons/icon-pause';
import './estimation.styles.css';
import { useTasks } from '../../context/task.context';

export const Estimation = ({ task }: EstimationProps) => {
  const { changeTask } = useTasks();
  const { estimation, estimationTime, spentTime, leftTime, overTime, run } = task.time;
  const [spentTimeVal, setSpentTimeVal] = useState(spentTime);
  const [overtimeVal, setOvertimeVal] = useState(overTime);
  const [leftTimeVal, setLeftTimeVal] = useState(leftTime);
  const progressIndex = ((spentTime - overTime * 2) / estimationTime) * 100;
  const overtimeIndex = (overtimeVal / estimationTime) * 100;

  useEffect(() => {
    if (run) {
      const interval = setInterval(() => {
        setSpentTimeVal(spentTimeVal => spentTimeVal + 1);
        setLeftTimeVal(leftTimeVal => leftTimeVal - 1);
        if (spentTime > estimationTime) {
          setOvertimeVal(overtimeVal => overtimeVal + 1);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  });

  const toggleRunTask = () => {
    const updatedEstimation = {
      ...task.time,
      spentTime: spentTimeVal,
      leftTime: leftTimeVal,
      overTime: overtimeVal
    }
    const updatedTask = { ...task, run: !run, estimation: updatedEstimation };
    changeTask(task.id, updatedTask);
  };

  return (
    <div className="estimation">
      <div className="estimation__header">
        <p className="value">
          Estimation: <strong>{estimation}</strong>
        </p>
        {task.type === 'inProgress' && (
          <button onClick={toggleRunTask}>
            {/* {task.run ? <PauseIcon /> : <PlayIcon />} */}
          </button>
        )}
      </div>
      {leftTime > 0 && (
        <>
          <div className="estimation__progress-bar">
            <div
              className="estimation__progress"
              style={{ width: `${progressIndex}%` }}
            ></div>
            <div
              className="estimation__overtime"
              style={{ width: `${overtimeIndex}%` }}
            ></div>
          </div>
          <div className="estimation__progress-values">
            <span className="estimation__spent">Spent: {spentTime}</span>
            {leftTimeVal > 0 && (
              <span className="estimation__remaining">Remaining: {leftTimeVal}</span>
            )}
            {!!overtimeVal && <span className="estimation__over">Over: {overtimeVal}</span>}
          </div>
        </>
      )}
    </div>
  );
};
