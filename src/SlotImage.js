class SlotImage {
    createImageNode = (fileName) => {
        const image = new Image();
        image.src = fileName;
        return image;
    }
}
export {SlotImage};