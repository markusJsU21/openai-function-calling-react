import { useState } from "react"
import axios from "axios"
import { add_numbers, addNumbersDescription } from "./Functions"

export const Example = () => {
    const [query, setQuery] = useState('')
    const [authorData, setAuthorData] = useState('')

    async function fetch_author(author) {
        console.log('fetching data about the author: ', author)
        try {
            const response = await axios.get(`https://openlibrary.org/search/authors.json?q=${author}`)
            if (response.data.docs.length > 0) {
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

    async function run_conversation(querystring) {
        const baseUrl = 'https://api.openai.com/v1/chat/completions'
        const headers = {
            "Conent-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`
        }

        let data = {
            model: "gpt-3.5-turbo-1106",
            messages: [
                {
                    role: "user",
                    content: querystring
                }
            ],
            functions: [
                {
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
                },
                addNumbersDescription
            ]
        }
        try {
            console.log('Sending req to openai')
            const response = await axios.post(baseUrl, data, { headers: headers })
            const message = response.data.choices[0].message
            const function_name = message.function_call.name
            if (function_name === 'fetch_author') {
                const functionArgs = JSON.parse(message.function_call.arguments)
                const function_response = await fetch_author(functionArgs.author)
                data.messages.push({
                    role: "function",
                    name: function_name,
                    content: function_response
                })

                console.log('Sending req to openai..')
                const secondresponse = await axios.post(baseUrl, data, { headers: headers })
                
            
            } else if(function_name === 'add_numbers') {
                const functionArgs = JSON.parse(message.function_call.arguments)
                const function_response = add_numbers(functionArgs.arrayOfNumbers)

                data.messages.push({
                    role: "function",
                    name: function_name,
                    content: function_response
                })
            }

            console.log(response.choices[0].message.content)

        } catch (err) {
            console.log('there was an error: ', err)
        }
    }

    return (
        <div className="d-flex gap-4 flex-column align-items-center bg-dark" style={{ width: "100vw", height: "100vh" }}>
            <h1 className="text-light mt-5">openai function calls</h1>
            <div className="d-flex gap-3">
                <input type="text" className="form-control" onChange={(e) => setQuery(e.target.value)} />
                <button className="btn btn-primary" onClick={() => run_conversation(query)}>Go</button>
                {authorData && <div>
                    {authorData}
                </div>}

            </div>
        </div>
    )
}