export const TaskTemplate = {
	id: '',
	type: '',
	title: '',
	description: '',
	isActive: false,
	subtasks: [],
	time: {
		estimation: '',
		estimationTime: 0,
		spentTime: 0,
		leftTime: 0,
		overTime: 0,
	},
};

export const TaskVariants = {
	BACKLOG: 'backlog',
	TODO: 'todo',
	IN_PROGRESS: 'inProgress',
	DONE: 'done',
} as const;

export const GhostTaskConfig = {
	title: 'Создание нового задания',
	description:
		'Для эффективного создания заданий давай делать это в последующие несколько шагов:',
	steps: [
		'Пойми, что именно нужно сделать',
		'Подумай над тем, как это можно сделать',
		'Соотнеси придуманный способ решения проблемы с самой проблемой',
		'Если все хорошо, смело создавай задание и приступай к его выполнению ;)',
	],
};

export const GhostProjectConfig = {
	title: 'Создание нового проекта',
	description:
		'Для эффективного создания проектов давай делать это в последующие несколько шагов:',
	steps: [
		'Определи цель проекта',
		'Разбей проект на задачи',
		'Установи сроки выполнения задач',
		'Отслеживай прогресс выполнения задач',
	],
};

export type GhostItemConfig = {
	title: string;
	description: string;
	steps: string[];
};

export type SubtaskType = {
	id: string;
	value: string;
	checked: boolean;
};

export type TimeUnits = {
	w: number;
	d: number;
	h: number;
	m: number;
};

export type TaskTimeType = {
	estimation: string;
	estimationTime: number;
	spentTime: number;
	leftTime: number;
	overTime: number;
};

export type TaskVariantType = 'backlog' | 'todo' | 'inProgress' | 'done';

export type TaskType = {
	boardId: string;
	id: string;
	creationDate: number;
	type: TaskVariantType;
	title: string;
	description?: string;
	isActive: boolean;
	subtasks: SubtaskType[];
	time: TaskTimeType;
};

export const FormViews = {
	LOGIN: 'login',
	SIGN_UP: 'sign_up',
};

export const taskGroupList = [
	TaskVariants.BACKLOG,
	TaskVariants.TODO,
	TaskVariants.IN_PROGRESS,
	TaskVariants.DONE,
];

export enum PanelViews {
	ADD = 'add',
	AUTH = 'auth',
	EDIT = 'edit',
	SEARCH = 'search',
}

export type PanelTypes = 'search' | 'auth' | 'add' | 'edit' | null;

export type UserType = {
	displayName: string;
	email: string;
	password: string;
	createdAt: Date;
	tasks: TaskType[];
	time: TaskTimeType;
};

export type BoardType = {
	id: string;
	title: string;
	description?: string;
	color: string;
	tasks?: TaskType[];
};
