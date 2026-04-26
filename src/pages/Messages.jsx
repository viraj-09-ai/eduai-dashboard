import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, CheckCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStudents } from "../context/StudentContext"; // 🔥 IMPORT LIVE DATA

const CONTACTS = [
  { id: 1, name: "EduAI Data Analyst", role: "Cloud AI Model", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=System&backgroundColor=111111" },
  { id: 2, name: "Sarah Jenkins", role: "Head of Science", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=111111" },
  { id: 3, name: "IT Support", role: "Helpdesk", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=IT&backgroundColor=111111" }
];

export default function Messages() {
  const { token } = useAuth();
  const { students } = useStudents(); // 🔥 GRAB LIVE STUDENTS DATA
  
  const [activeChatId, setActiveChatId] = useState(1);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const activeContact = CONTACTS.find(c => c.id === activeChatId);
  const filteredContacts = CONTACTS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // 📥 FETCH MESSAGES FROM MONGODB
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${activeChatId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [activeChatId, token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => scrollToBottom(), [messages, isBotTyping]);

  // 🟢 SEND MESSAGE & TRIGGER CLOUD AI (GROQ) WITH DATA INJECTION
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText("");

    // 1. Show user message instantly
    const newMsgData = { chatId: activeChatId, text: userText, sender: "me" };
    const optimisticMsg = { ...newMsgData, _id: Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      // Save User message to DB
      await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(newMsgData)
      });

      // 🤖 IF CHATTING WITH THE CLOUD AI (ID: 1)
      if (activeChatId === 1) {
        setIsBotTyping(true); 

        try {
          // Grab the API key from your .env file
          const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

          if (!GROQ_API_KEY) {
            throw new Error("Missing Groq API Key! Please check your .env file.");
          }

          // 🔥 THE MAGIC: Create a dynamic string of your live database
          const databaseContext = JSON.stringify((students || []).map(s => ({
            name: s.name,
            marks: s.marks,
            attendance: s.attendance,
            status: s.marks < 50 || s.attendance < 75 ? "At Risk" : "Good"
          })));

          // 🧠 INJECT THE DATA INTO THE AI'S BRAIN
          const systemPrompt = `You are EduAI, an intelligent data analyst for a school dashboard. 
          Here is the live student database: ${databaseContext}. 
          Always answer the user's questions based ONLY on this exact data. 
          If they ask for weak students, list their names, marks, and attendance, and provide a short reason (like low attendance). 
          If they ask for averages, calculate it from the data.
          Keep your formatting clean and easy to read.`;

          // Fetch response from Groq's insanely fast cloud API
          const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant", // Fast, highly capable free model
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userText }
              ],
              temperature: 0.2 // Lower temperature makes the AI more analytical
            })
          });

          const aiData = await aiResponse.json();
          
          if (aiData.error) {
             throw new Error(aiData.error.message);
          }

          const botReplyText = aiData.choices[0].message.content;

          const botMsgData = { chatId: 1, text: botReplyText, sender: "them" };

          // Show AI message on screen
          const optimisticBotMsg = { ...botMsgData, _id: Date.now() + 1, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          setMessages(prev => [...prev, optimisticBotMsg]);
          
          // Save AI message to MongoDB
          await fetch("http://localhost:5000/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(botMsgData)
          });

        } catch (error) {
          console.error("Cloud AI Server Error:", error);
          setMessages(prev => [...prev, { _id: Date.now()+1, chatId: 1, text: `Error: ${error.message}`, sender: "them", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
          setIsBotTyping(false);
        }
      }
    } catch (error) {
      console.error("Failed to save message", error);
    }
  };

  return (
    <div className="p-6 sm:p-8 h-screen bg-[#050505] text-[#E0E0E0] w-full max-w-[1400px] mx-auto flex flex-col font-sans overflow-hidden">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-[26px] font-bold text-white tracking-tight">Communications</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1 bg-[#0A0A0A] border border-[#1A1A1A] rounded-[2rem] shadow-2xl overflow-hidden flex min-h-0">
        
        {/* LEFT SIDEBAR (Contacts) */}
        <div className="w-80 border-r border-[#1A1A1A] flex flex-col bg-[#050505]/50">
          <div className="p-5 border-b border-[#1A1A1A]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={16} />
              <input type="text" placeholder="Search contacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#111] border border-[#222] text-white rounded-xl pl-11 pr-4 py-2.5 outline-none focus:border-[#22C55E]/50 text-sm" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {filteredContacts.map(contact => (
              <div key={contact.id} onClick={() => setActiveChatId(contact.id)} className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${activeChatId === contact.id ? "bg-[#22C55E]/10 border-[#22C55E]/20" : "bg-transparent border-transparent hover:bg-[#111]"}`}>
                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full bg-[#111] border border-[#222] p-0.5" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${activeChatId === contact.id ? "text-[#22C55E]" : "text-white"}`}>{contact.name}</p>
                  <p className="text-xs text-[#666] truncate">{contact.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT AREA (Chat Feed) */}
        {activeContact && (
          <div className="flex-1 flex flex-col bg-[#0A0A0A]">
            <div className="p-5 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0A0A0A] shrink-0">
              <div className="flex items-center gap-4">
                <img src={activeContact.avatar} alt="avatar" className="w-10 h-10 rounded-full bg-[#111] border border-[#222] p-0.5" />
                <div>
                  <h2 className="text-base font-bold text-white">{activeContact.name}</h2>
                  <p className="text-xs text-[#22C55E] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span> {activeContact.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
              {isLoading ? (
                <div className="flex justify-center items-center h-full text-[#666] text-sm animate-pulse">Syncing secure connection...</div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-[#555] text-sm font-medium">No message history found.</div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg._id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] ${msg.sender === "me" ? "order-1" : "order-2"}`}>
                        <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.sender === "me" ? "bg-[#22C55E] text-black rounded-br-sm" : "bg-[#1A1A1A] text-[#E0E0E0] border border-[#222] rounded-bl-sm"}`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-[10px] text-[#555] ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                          {msg.time}
                          {msg.sender === "me" && <CheckCheck size={12} className="text-[#22C55E]" />}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* BOT TYPING INDICATOR */}
                  {isBotTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                       <div className="px-5 py-4 rounded-2xl bg-[#1A1A1A] border border-[#222] rounded-bl-sm flex items-center gap-1.5">
                         <span className="w-2 h-2 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                         <span className="w-2 h-2 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                         <span className="w-2 h-2 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-5 border-t border-[#1A1A1A] bg-[#0A0A0A] shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input type="text" placeholder={`Message ${activeContact.name.split(' ')[0]}...`} value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full bg-[#111] border border-[#222] text-white rounded-xl pl-4 pr-12 py-3 outline-none focus:border-[#22C55E]/50 text-sm shadow-inner transition-all" />
                </div>
                <button type="submit" disabled={!inputText.trim() || isBotTyping} className="p-3 bg-[#22C55E] text-black rounded-xl hover:bg-[#1db954] disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(34,197,94,0.15)] shrink-0">
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}