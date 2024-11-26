export type Answer = {
	id: string,
	student: string,
	block: string,
	isCorrect: boolean,
	meta: any,
}

export type Block = {
	id: string,
	answerData: Answer | null,
	kind: string,
	order: Number,
	template: string,
	meta: any,
}
