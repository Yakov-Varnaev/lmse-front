import type { Reactive } from "vue";
import { createAnswer } from "~/api/courses";
import type { Block } from "~/types";

export function useBlock(emit: any, props: any) {
	const blockEditMode = ref(false);
	const blockData = ref({ ...props.block.meta });

	function toggleEditMode() {
		blockEditMode.value = !blockEditMode.value;
	}

	async function update(blockData: Object) {
		emit("update", props.block, blockData);
		toggleEditMode();
	}

	async function deleteBlock() {
		emit("delete", props.block.id);
	}

	async function processAnswer(courseId: string, chapterId: string, lessonId: string, data: any) {
		const loader = useLoader();
		loader.startKeyLoading(`${props.block.id}-answer`);
		const { data: respData } = await createAnswer(
			courseId,
			chapterId,
			lessonId,
			props.block.id,
			data,
		);
		loader.stopKeyLoading(`${props.block.id}-answer`);
		return respData;
	}

	return {
		blockEditMode,
		blockData,
		toggleEditMode,
		update,
		deleteBlock,
		processAnswer,
	};
}

export function useAnswer(courseId: string, chapterId: string, lessonId: string, block: Block<any>) {
	const loader = useLoader();
	async function create(data: any) {
		loader.startKeyLoading(`${block.id}-answer`);
		const { data: respData } = await createAnswer(
			courseId,
			chapterId,
			lessonId,
			block.id,
			data,
		);
		loader.stopKeyLoading(`${block.id}-answer`);
		return respData;
	}

	return { create };
}

export function useBlockCard<AnswerType extends Object, AnswerExtra extends Object>(
	{
		block,
		initialAnswerData,

	}: {
		block: Block<any>,
		initialAnswerData: () => AnswerType,

	},
	{
		answerProcessor = {
			to: (answer: Reactive<AnswerType>) => answer,
			from: (answer: any): AnswerType => answer,
		}
	}: Partial<{
		answerProcessor: {
			to: (answer: Reactive<AnswerType>) => any,
			from: (answer: any) => AnswerType,
		}
	}> = {},
) {
	const context = useCourseContext();
	const loader = useLoader();
	const courseId = inject<string>("courseId")!;
	const chapterId = inject<string>("chapterId")!;
	const lessonId = inject<string>("lessonId")!;

	const answerGiven = ref(block.answerData !== null);
	const isCorrect = ref(false)
	const answerExtra = ref<AnswerExtra>(Object())
	const _data = initialAnswerData()

	if (!!block.answerData) {
		Object.assign(_data, answerProcessor.from(block.answerData.meta));
		isCorrect.value = block.answerData.isCorrect;
	}

	const answerData = reactive<AnswerType>(_data)

	async function processAnswer() {
		loader.startKeyLoading(`${block.id}-answer`);
		const { data: respData } = await createAnswer(
			courseId,
			chapterId,
			lessonId,
			block.id,
			answerProcessor.to(answerData),
			context.isOwner,
		);
		const { answer, result } = respData
		answerExtra.value = result
		loader.stopKeyLoading(`${block.id}-answer`);
		answerGiven.value = true;
		isCorrect.value = answer.isCorrect;
		return answer;
	}

	const isAnswerLoading = computed(() => {
		return loader.loaderMap[`${block.id}-answer`];
	});

	const reset = () => {
		Object.assign(answerData, initialAnswerData())
		answerGiven.value = false;
		isCorrect.value = false;
	}

	return {
		answerGiven,
		isCorrect,
		isAnswerLoading,
		processAnswer,
		answerData,
		answerExtra,
		reset,
	}
}
