
export const usePage = (defaultPageSize: number = 10) => {
	const count = ref(0);
	const pageSize = ref(defaultPageSize)
	const currentPage = ref(1)

	const show = computed((): boolean => {
		return count.value > pageSize.value
	})


	return { count, pageSize, currentPage, show }
}
