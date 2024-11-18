import { useFirestore } from '../../contexts/firestore.context';
import TaskGroup from '../task-group';
import './tasks.styles.css';

const taskGroupList = ['backlog', 'todo', 'inProgress', 'done'];

export const Tasks = () => {
	const { tasks } = useFirestore();

	return (
		<div className='tasks'>
			<ul className='tasks__group-list'>
				{taskGroupList.map((group) => (
					<TaskGroup key={group} group={group} tasks={tasks} />
				))}
			</ul>
		</div>
	);
};
