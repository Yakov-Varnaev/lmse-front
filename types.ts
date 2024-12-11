export type User = {
	id: string,
	email: string,
	firstName: string,
	lastName: string,
	avatar: string,
}

export type Course = {
	id: string,
	title: string,
	shortDescription: string,
	description: string,
	owner: {
		id: string,
		email: string,
		firstName: string,
		lastName: string,
	},
	created: Date,
	isStudent: boolean,
	state: string,
}

export type CourseTree = {
	id: string;
	title: string;
	chapters: {
		id: string,
		title: string,
		lessons: { id: string, title: string }[]
	}[]
}

export type Chapter = {
	id: string,
	order: number,
	title: string,
	description: string,
	course: string
	lessons: Lesson[],
}

export type Lesson = {
	id: string,
	title: string,
	order: number,
	description: string,
	chapter: string
}

export type Answer = {
	id: string,
	student: string,
	block: string,
	isCorrect: boolean,
	meta: any,
}


export type Block<Meta extends Object> = {
	id: string,
	answerData: Answer | null,
	kind: string,
	order: Number,
	template: string,
	meta: Meta,
}

export type QuestionBlockMeta = {
	text: string,
	variants: any[],
}

export type TextImageVariant = {
	id: number,
	text: string,
	image?: { src: string, id: string },
}

export type ConnectionBlockMeta = {
	text: string,
	variants: {
		left: { id: number, text: string, image?: { src: string, id: string } },
		right: { id: number, text: string, image?: { src: string, id: string } },
	}[]
}
