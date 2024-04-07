import { useState } from "react"
import axios from "axios"
import { add_numbers, addNumbersDescription, fetch_author, fetchAuthorDescription } from "./Functions"
import { Message } from "./Message"

export const Example = () => {
    const [query, setQuery] = useState('')
    const [messages, setMessages] = useState([{role: "system", content: "You are a helpful assistant."}])

    const availableFunctions = {
        fetch_author,
        add_numbers
    }

    async function run_conversation(messages) {
        const baseUrl = 'https://api.openai.com/v1/chat/completions'
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`
        }

        let data = {
            model: "gpt-3.5-turbo-1106",
            messages,
            functions: [
                fetchAuthorDescription,
                addNumbersDescription
            ]
        }
        
        setMessages(([...data.messages]))   
        try {
            const response = await axios.post(baseUrl, data, { headers: headers })
            const finish_reason = response.data.choices[0].finish_reason
            const message = response.data.choices[0].message

            if (finish_reason === 'function_call') {
                const function_name = message.function_call.name
                const functionArgs = JSON.parse(message.function_call.arguments)
                const function_response = await availableFunctions[function_name](functionArgs)

                data.messages.push({
                    role: "function",
                    name: function_name,
                    content: function_response
                })
                setMessages(([...data.messages]))
                const response2 = await axios.post(baseUrl, data, { headers: headers })
                const finish_reason2 = response2.data.choices[0].finish_reason
                const message2 = response2.data.choices[0].message
                if(finish_reason2 === 'stop'){
                    data.messages.push({
                        role: "assistant",
                        content: message2.content
                    })
                }
                setMessages(([...data.messages]))

            } else if (finish_reason === 'stop') {
                data.messages.push({
                    role: "assistant",
                    content: message.content
                })
                setMessages(([...data.messages]))
            }

        } catch (err) {
            console.log('there was an error: ', err)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const userMessage = e.target.query.value
        const newMessages = [...messages, {
            role: "user", content: userMessage
        }]
        run_conversation(newMessages)
        setQuery('')
    }

    return (
        <div className="d-flex gap-4 flex-column align-items-center bg-dark p-5" style={{ width: "100vw", height: "100vh" }}>
            <h1 className="text-light mt-5">openai function calls</h1>
            <form onSubmit={handleSubmit} action="">
                <div className="d-flex flex-column gap-2 bg-secondary mb-3 p-3 rounded">
                    {messages.length > 0 && messages.map((msg, index) => {
                        return msg.role === 'system' || msg.role === 'function' ? '' : <Message key={index} content={msg.content} role={msg.role}></Message>
                        })
                    }
                </div>
                <div className="d-flex gap-3">
                    <input type="text" className="form-control" name="query" value={query} onChange={(e) => setQuery(e.target.value)} />
                    <button type="submit" className="btn btn-primary">Go</button>

                </div>
            </form>
        </div>
    )
}