const createFileUrl = async (file: File) => {
  const blobParts = await file.arrayBuffer();
  return URL.createObjectURL(new Blob([blobParts], { type: file.type }));
};
