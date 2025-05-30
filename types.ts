// ============================
// Generic & Utility Types
// ============================

export type Page<T> = {
	count: number;
	results: T[];
};

export type Answer<Meta extends object> = {
	id: string;
	student: string;
	block: string;
	isCorrect: boolean;
	meta: Meta;
};

export type TemplateData = {
	id: string;
	kind: string;
	version: string;
};

// ============================
// Media Types
// ============================

export type ImageData = {
	id: string;
	src: string;
};

export type VideoData = {
	id: string;
	src: string;
};

export type TextImageData = {
	text: string;
	image?: ImageData;
};

export type TextImageVariant = TextImageData & {
	id: string;
};

// ============================
// User & Course Domain
// ============================

export type User = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	avatar: string;
};

export type Category = {
	id: string;
	name: string;
	parent?: Category;
};

export type Course = {
	id: string;
	image: string;
	title: string;
	shortDescription: string;
	description: string;
	category?: Category;
	level: 'beginner' | 'medium' | 'advanced';
	tags: string[];
	chaptersCount: number,
	lessonsCount: number,
	owner: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
	};
	created: Date;
	isStudent: boolean;
	state: string;
};

export type CourseTree = {
	id: string;
	title: string;
	chapters: {
		id: string;
		title: string;
		lessons: {
			id: string;
			title: string;
		}[];
	}[];
};

export type Chapter = {
	id: string;
	order: number;
	title: string;
	description: string;
	course: Course;
	lessons: Lesson[];
};

export type Lesson = {
	id: string;
	title: string;
	order: number;
	description: string;
	chapter: string;
};

// ============================
// Block & Template Structure
// ============================

export type Block<Meta extends object> = {
	id: string;
	answerData: Answer<any> | null;
	kind: string;
	order: number;
	template: string;
	children: Block<any>[];
	meta: Meta;
};

// ============================
// Block Metas and Answers
// ============================

// -- Video Block
export type VideoBlockMeta = {
	title: string;
	video?: VideoData;
};

// -- Text Block

export type TextBlockMeta = {
	content: string;
}

// -- Question Block

export type QuestionBlockVariant = TextImageVariant & {
	correct: boolean;
}

export type QuestionBlockMeta = {
	text: string;
	variants: QuestionBlockVariant[];
};

// -- Ordering Block
export type OrderingBlockOption = {
	id: number;
	text: string;
};

export type OrderingAnswer = {
	order: number[];
};

export type OrderingBlockMeta = {
	text: string;
	failOnFirst: boolean;
	options: OrderingBlockOption[];
};

// -- Connection Block
export type ConnectionBlockMeta = {
	text: string;
	variants: {
		left: TextImageVariant;
		right: TextImageVariant;
	}[];
};

// -- Open Question Block
export type OpenQuestionBlockMeta = {
	text: string;
	answer: {
		text: string;
	};
	caseSensitive: boolean;
	isNumeric: boolean;
};

// -- Group Distribution Block
export type GroupDistributionItem = TextImageData & {
	id: string;
	groupId: string;
};

export type GroupDistributionGroup = {
	id: string;
	title: string;
	items: GroupDistributionItem[];
};

export type GroupDistributionMeta = {
	text: string;
	groups: GroupDistributionGroup[];
};

export type GroupDistributionAnswer = {
	groups: { [key: string]: GroupDistributionItem[] };
};

// -- True/False Block
export type TrueFalseBlockMeta = {
	text: string;
	allowUnknown: boolean;
	statements: {
		id: number;
		text: string;
		value: 'true' | 'false' | 'unknown';
	}[];
};

// -- Correct Order Dialog Block
export type CorrectOrderDialogOption = TextImageVariant & {
	sender: string;
	right: boolean;
};

export type CorrectOrderDialogBlockMeta = {
	text: string;
	failOnFirst: boolean;
	options: CorrectOrderDialogOption[];
};

export type CorrectOrderDialogAnswer = {
	order: number[];
};

