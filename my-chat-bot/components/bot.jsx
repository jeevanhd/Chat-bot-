import React, { useState } from "react";

const Bot = () => {
  const [message, Setmessage] = useState([]);
  const [user_Input, setuserinput] = useState("");

  const sendmessage = async () => {
    if (!user_Input.trim()) return;

    const newMessage = [...message, { sender: "user", tesx: user_Input }];
    Setmessage(newMessage);
    setuserinput("");

    try {
      const responce = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          message: [
            { role: "system", content: "you are helpful assistant" },
            ...newMessage.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
          ],
        },
        {
          headers: {
            "content-type": "application.json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const bot_responce = responce.data.choices[0].message.content;
      Setmessage(...newMessage, { sender: "bot", text: bot_responce });
    } catch (error) {
      console.log(error);
      Setmessage(...newMessage, {
        sender: "bot",
        text: "something went wrong.try again stupid",
      });
    }
  };
  return (
    <div>
      <h1>My chat bot</h1>
      <div>
        {message.map((msg, index) => (
          <div
            key={index}
            style={{ textAlign: msg.sender === "user" ? "right" : "left" }}
          >
            <strong>{msg.sender === "user" ? "you" : "bot"}</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={user_Input}
        onChange={(e) => setuserinput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendmessage()}
        placeholder="Type a message..."
      />
      <button onClick={sendmessage}>Send</button>
    </div>
  );
};

export default Bot;
