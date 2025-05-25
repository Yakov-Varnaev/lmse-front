export type Page<T> = {
	count: number
	results: T[]
}

export type ImageData = {
	id: string,
	file: string,
}

export type VideoData = {
	id: string,
	src: string,
}

export type TextImageData = {
	text: string,
	image?: ImageData
}

export type Category = {
	id: string,
	name: string,
	parent?: Category
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
	image: string,
	title: string,
	shortDescription: string,
	description: string,
	category?: Category,
	level: 'beginner' | 'medium' | 'advanced',
	tags: string[],
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
	course: Course,
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

export type TemplateData = {
	id: string,
	kind: string,
	version: string,
}


export type Block<Meta extends Object> = {
	id: string,
	answerData: Answer<any> | null,
	kind: string,
	order: number,
	template: string,
	children: Block<any>[],
	meta: Meta,
}

export type VideoBlockMeta = {
	title: string,
	video?: VideoData,
}

export type QuestionBlockMeta = {
	text: string,
	variants: any[],
}

export type TextImageVariant = {
	// TODO: use uuids only!
	id: string,
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

export type CorrectOrderDialogOption = TextImageVariant & {
	sender: string;
	right: boolean;
}

export type CorrectOrderDialogBlockMeta = {
	text: string;
	failOnFirst: boolean;
	options: CorrectOrderDialogOption[];
}

export type CorrectOrderDialogAnswer = {
	order: number[];
}
