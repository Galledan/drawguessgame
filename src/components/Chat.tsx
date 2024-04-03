import React, { useState, useRef, useEffect } from 'react';
import { BsArrowRightSquareFill } from 'react-icons/bs';

const Chat = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior:  'auto' });
        }
    }, [messages]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSendMessage = () => {
        if (inputValue.trim() !== '') {
            setMessages([...messages, inputValue]);
            setInputValue('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className='w-full h-full flex flex-col gap-5'>
            <div className='w-full h-[150px] overflow-y-auto bg-white rounded-lg'>
                {messages.map((message, index) => (
                    <div key={index} style={{ padding: '5px' }}>
                        {message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className='mr-3'
                />
                <button onClick={handleSendMessage}><BsArrowRightSquareFill /></button>
            </div>
        </div>
    );
};

export default Chat;
