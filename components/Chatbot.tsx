import React, { useState, useRef, useEffect } from 'react';
import { Content } from "@google/genai";
import Button from './ui/Button';
import Input from './ui/Input';
import { getChatbotResponse } from '../services/geminiService';
import { Event } from '../types';

const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.9_9.9a4.4 4.4 0 0 1 0-6.2 4.4 4.4 0 0 1 6.2 0l1.4 1.4a4.4 4.4 0 0 1 0 6.2 4.4 4.4 0 0 1-6.2 0Z"/><path d="m22 2-7 2-3 7-2 7 7-2 7-3Z"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

interface ChatbotProps {
    events: Event[];
}

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

const Chatbot: React.FC<ChatbotProps> = ({ events }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{id: 1, text: "Hello! How can I help you find the perfect event today?", sender: 'ai'}]);
        }
    }, [isOpen, messages]);

    const handleSend = async () => {
        if (!userInput.trim() || isLoading) return;
        const newUserMessage = { id: Date.now(), text: userInput, sender: 'user' as const };
        
        const currentMessages = [...messages, newUserMessage];
        setMessages(currentMessages);
        setUserInput('');
        setIsLoading(true);

        const chatHistory: Content[] = currentMessages
          .filter(m => m.sender === 'ai' ? m.text.length > 0 : true) // Ensure no empty AI messages in history
          .map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        try {
            const aiResponseText = await getChatbotResponse(userInput, events, chatHistory);
            const newAiMessage = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' as const };
            setMessages(prev => [...prev, newAiMessage]);
        } catch (error) {
            const errorMessage = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting. Please try again.", sender: 'ai' as const };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-5 right-5 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-full' : 'translate-y-0'}`}>
                <Button size="icon" className="rounded-full w-16 h-16 shadow-lg" onClick={() => setIsOpen(true)}>
                    <ChatIcon />
                </Button>
            </div>
            
            <div className={`fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-50 w-full h-full sm:w-96 sm:h-[600px] bg-card border shadow-2xl rounded-lg flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-bold text-lg">EventEase Assistant</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><CloseIcon /></Button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                           <div className="max-w-[80%] p-3 rounded-xl bg-secondary">
                               <div className="flex items-center space-x-2">
                                   <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></span>
                                   <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75"></span>
                                   <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                               </div>
                           </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                        <Input 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask about an event..."
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || !userInput.trim()}>
                            <SendIcon />
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Chatbot;