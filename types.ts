export type ImageData = {
	id: string,
	file: string,
}

export type TextImageData = {
	text: string,
	image?: ImageData
}

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

export type Answer<Meta extends Object> = {
	id: string,
	student: string,
	block: string,
	isCorrect: boolean,
	meta: Meta,
}


export type Block<Meta extends Object> = {
	id: string,
	answerData: Answer<any> | null,
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

export type GroupDistributionItem = TextImageData & {
	id: string
	groupId: string
}
export type GroupDistributionGroup = {
	id: string,
	title: string,
	items: GroupDistributionItem[]
}

export type GroupDistributionMeta = {
	text: string,
	groups: GroupDistributionGroup[],

}

export type GroupDistributionAnswer = {
	groups: { [key: string]: GroupDistributionItem[] }
}

export type TrueFalseBlockMeta = {
	text: string,
	allowUnknown: boolean,
	statements: {
		id: number,
		text: string,
		value: 'true' | 'false' | 'unknown',
	}[],
}
