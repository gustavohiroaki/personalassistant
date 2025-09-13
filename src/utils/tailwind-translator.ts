export const gapClasses = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
    10: "gap-10",
    12: "gap-12",
}
export const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
}
export const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
}
export const colors = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-500 text-white",
    success: "bg-green-500 text-white",
    danger: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-300 text-white",
    light: "bg-gray-200 text-black",
    dark: "bg-gray-800 text-white",
    transparent: "bg-transparent text-black",
    gray: "bg-gray-500 text-white"
}
export const hoverHelper = (color: string) => {
    const colorGrade = color.split("-")[2];
    return `hover:bg-${color.split("-")[1]}-${parseInt(colorGrade) + 100} transition-colors`;
};
export const build = (classesArr: Array<string>) => classesArr.join(' ');
export type Cols = keyof typeof colClasses;
export type Gap = keyof typeof gapClasses;
export type Justify = keyof typeof justifyClasses;
export type Color = keyof typeof colors;