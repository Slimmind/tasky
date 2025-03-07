import './ghost-task.style.css';
import { PanelViews } from '../../utils/constants';
import { usePanel } from '../../context/panel.context';

export const GhostTask = () => {
	// const [subtask, setSubtask] = useState()
	const { setActivePanel } = usePanel();
	return (
		<li className='ghost-task' onClick={() => setActivePanel(PanelViews.ADD)}>
			<header className='ghost-task__header'>
				<h4 className='ghost-task__title'>Создание нового задания</h4>
			</header>
			<div className='ghost-task__body'>
				<em className='ghost-task__description'>
					Для эффективного создания заданий давай делать это в последующие
					несколько шагов:
				</em>
				{/* <ul className='ghost-task__subtasks'>
					{data.subtasks.map((subtask) => (

					))}
				</ul> */}
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
		</li>
	);
};
