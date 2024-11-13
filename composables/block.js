export function useBlock(emit, props) {
  const blockEditMode = ref(false);
  const blockData = ref({ ...props.block.meta });

  function toggleEditMode() {
    blockEditMode.value = !blockEditMode.value;
  }

  async function update(blockData) {
    emit("update", props.block, blockData);
    toggleEditMode();
  }

  async function deleteBlock() {
    emit("delete", props.block.id);
  }

  return { blockEditMode, blockData, toggleEditMode, update, deleteBlock };
}
