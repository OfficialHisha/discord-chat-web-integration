export function isEmptyString(str: string | undefined): boolean {
    return (!str || str.trim() === "");
}

export const deleteArrayElement = (element: any, array: any[]) => {
    const index = array.indexOf(element, 0);
    if (index > -1) {
        array.splice(index, 1);
    }
}