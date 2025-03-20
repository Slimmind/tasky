import { lazy } from 'react';

const Panel = lazy(() => import('../panel'));

export const Boards = () => {
	return (
		<Panel filled={true} isActive={true} title='Проекты' mod='boards'>
			<p>
				<em>
					Совсем скоро здесь появятся проекты и задания можно будет разделять
					между ними, чтобы у каждого проекта был свой список заданий :)
				</em>
			</p>
		</Panel>
	);
};
