import type { EmitFn } from "vue";
import { createAnswer } from "~/api/courses";
import type { Block } from "~/types";

export function useBlock(emit: EmitFn, props: any) {
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

	async function processAnswer(courseId: string, chapterId: string, lessonId: string, data: Object) {
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

export function useAnswer(courseId: string, chapterId: string, lessonId: string, block: Block) {
	const loader = useLoader();
	async function create(data: Object) {
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

export function useBlockCard<T extends Object>({ block, initialAnswerData }: { block: Block, initialAnswerData: () => T }) {
	const loader = useLoader();
	const courseId = inject("courseId");
	const chapterId = inject("chapterId");
	const lessonId = inject("lessonId");

	const answerGiven = ref(block.answerData !== null);
	const isCorrect = ref(false)
	const _data = initialAnswerData()
	if (block.answerData !== null) {
		Object.assign(_data, block.answerData.meta)
	}

	const answerData = reactive(_data)

	async function processAnswer() {
		loader.startKeyLoading(`${block.id}-answer`);
		const { data: respData } = await createAnswer(
			courseId,
			chapterId,
			lessonId,
			block.id,
			answerData
		);
		loader.stopKeyLoading(`${block.id}-answer`);
		answerGiven.value = true;
		isCorrect.value = respData.isCorrect;
		return respData;
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
		reset,
	}
}
