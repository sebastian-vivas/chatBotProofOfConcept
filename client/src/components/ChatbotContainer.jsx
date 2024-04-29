import React, { useState, useRef, useEffect } from "react";
import { Card, User, Textarea } from "@nextui-org/react";
import UserInput from "./UserInput";

export default function ChatbotContainer({ darkMode }) {
  const [messages, setMessages] = useState([
    {
      author: "RC Student",
      content: "What tools can I use to debug?",
      timestamp: new Date(),
    },
    {
      author: "Chatbot",
      content: "Response 1",
      timestamp: new Date(),
    },
    // Add more initial messages as needed
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    updateMessagesContainerHeight();
  }, [messages]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async () => {
    const newMessage = {
      author: "RC Student",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Make an API call to the server to get the chatbot response
    try {
      const response = await fetch("http://localhost:3000/openai-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queryParameter: inputMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from server");
      }

      const responseData = await response.json();

      const chatbotResponse = {
        author: "Chatbot",
        content: responseData.choices[0].text.trim(),
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, chatbotResponse]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInputMessage("");
  };

  const updateMessagesContainerHeight = () => {
    if (messagesContainerRef.current) {
      const containerHeight = messagesContainerRef.current.scrollHeight;
      messagesContainerRef.current.style.height = `${containerHeight}px`;
    }
  };

  return (
    <div className="col-span-3">
      <div className={`${darkMode.value ? "dark" : "light"}`}>
        <Card className="pl-40 pr-40 mt-2 chatbot-container">
          <User
            className="pb-5 pt-8"
            name="RC Student"
            description="Software Engineer"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            }}
          />
          <div
            className="messages-container mb-4 overflow-y-auto"
            style={{ maxHeight: "30rem" }}
            ref={messagesContainerRef}
          >
            {messages.map((message, index) => (
              <div key={index} className="message-container ">
                <div
                  className={
                    message.author === "Chatbot"
                      ? "chatbot-message"
                      : "user-message"
                  }
                >
                  <Textarea
                    className="pb-2 fullwidth"
                    isReadOnly
                    variant="bordered"
                    value={message.content}
                    label={message.author}
                    color={
                      message.author === "RC Student" ? "secondary" : "primary"
                    }
                    minRows={1}
                    maxRows={2}
                  />
                </div>
                <p
                  className={
                    message.author === "Chatbot"
                      ? "text-xs text-gray-500 text-left"
                      : "text-xs text-gray-500 text-right"
                  }
                >
                  {message.timestamp.toLocaleString()}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <UserInput
            inputMessage={inputMessage}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </Card>
      </div>
    </div>
  );
}
