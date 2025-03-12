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
    run: false
	},
};

export const TaskVariants = {
	BACKLOG: 'backlog',
	TODO: 'todo',
	IN_PROGRESS: 'inProgress',
	DONE: 'done',
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
  run: boolean;
};

export type TaskVariantType = 'backlog' | 'todo' | 'inProgress' | 'done';

export type TaskType = {
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
