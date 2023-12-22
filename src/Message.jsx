import React from "react"

export const Message = ({content, role}) => {
    return (
        <div className="bg-white d-flex align-items-center rounded">
            <p className="mb-0 p-3">
               {role}: {content}
            </p>
        </div>
    )
}