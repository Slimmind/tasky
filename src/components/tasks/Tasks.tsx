import { useFirestore } from '../../contexts/firestore.context';
import { taskGroupList } from '../../utils/constants';
import Skeleton from '../skeleton';
import TaskGroup from '../task-group';
import './tasks.styles.css';

export const Tasks = () => {
	const { tasks } = useFirestore();
	// const { tasks } = [];

	return tasks?.length > 0 ? (
		<div className='tasks'>
			<ul className='tasks__group-list'>
				{taskGroupList.map((group: string) => (
					<TaskGroup key={group} group={group} tasks={tasks} />
				))}
			</ul>
		</div>
	) : (
		<Skeleton />
	);
};
