import { Link } from '@tanstack/react-router';
import './ghost-task.style.css';

type GhostTaskProps = {
	boardId: string;
};

export const GhostTask = ({ boardId }: GhostTaskProps) => {
	return (
		<li className='ghost-task'>
			<Link to='/tasks/add' search={{ boardId: boardId }}>
				<header className='ghost-task__header'>
					<h4 className='ghost-task__title'>Создание нового задания</h4>
				</header>
				<div className='ghost-task__body'>
					<em className='ghost-task__description'>
						Для эффективного создания заданий давай делать это в последующие
						несколько шагов:
					</em>
					<p className='ghost-task__subtask'>Пойми, что именно нужно сделать</p>
					<p className='ghost-task__subtask'>
						Подумай над тем, как это можно сделать
					</p>
					<p className='ghost-task__subtask'>
						Соотнеси придуманный способ решения проблемы с самой проблемой
					</p>
					<p className='ghost-task__subtask'>
						Если все хорошо, смело создавай задание и приступай к его выполнению
						;)
					</p>
				</div>
			</Link>
		</li>
	);
};
