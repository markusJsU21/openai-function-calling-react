export const add_numbers = (arrayOfNumbers) => {
    const initialValue = 0;
    const sumWithInitial = arrayOfNumbers.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    initialValue,
);
return JSON.stringify({
    success: true,
    message: 'The result is ' + sumWithInitial
})
}

export const addNumbersDescription = {
    name: "add_numbers",
    description: "Reduce a set of numbers.",
    type: "array",
    items: {
        type: "number",
        description: "One of the numbers to be included in the reduction"
    },
    required: ["arrayOfNumbers"]
};