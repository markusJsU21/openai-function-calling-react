import axios from "axios"

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


export async function fetch_author(author) {
    console.log('fetching data about the author: ', author)
    try {
        const response = await axios.get(`https://openlibrary.org/search/authors.json?q=${author}`)
        console.log('response: ', response)
        if (response.data.docs.length > 0) {
            console.log('response if true: ', response.data.docs[0].name)
            return JSON.stringify({
                success: true,
                message: `The name of the first found author is ${response.data.docs[0].name}`
            })

        } else {
            return JSON.stringify({
                success: false,
                message: `No authors found`
            })
        }

    } catch (err) {
        console.log(err)
    }
}

export const fetchAuthorDescription = {
    name: "fetch_author",
    description: "Fetch information about an author.",
    parameters: {
        type: "object",
        properties: {
            author: {
                type: "string",
                description: "The name of a famous author."
            },
        },
        required: ['author']
    }
} 