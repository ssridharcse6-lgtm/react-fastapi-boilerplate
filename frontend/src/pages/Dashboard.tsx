// src/pages/Dashboard.tsx
import React, { useEffect, useState, useRef } from 'react';
import { getDashboardData, sendMessage } from '../api';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiSend } from 'react-icons/fi';
import { BiEdit } from "react-icons/bi";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; from: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const menuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!token) navigate('/login');
    else {
      getDashboardData(token)
        .then((res) => setData(res.data))
        .catch(() => navigate('/login'));
    }
  }, [token]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    // add user message locally
    setMessages((prev) => [...prev, { text: userMsg, from: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendMessage(token, userMsg, messages);
      const botReply = res.data?.reply || "Sorry, no response.";
      setMessages((prev) => [...prev, { text: botReply, from: 'bot' }]);
    } catch (err) {
      console.error('chat error', err);
      setMessages((prev) => [...prev, { text: 'Error: failed to get response', from: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <h2>Welcome <b>{data?.username || 'Loading...'}!</b></h2>

        <div style={{ position: 'relative' }} ref={menuRef}>
          <FiMoreVertical
            size={24}
            style={{ cursor: 'pointer' }}
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 4,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 100,
              }}
            >
              <div
                onClick={handleLogout}
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          padding: 20,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1000,
            height: '90%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 8,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Top bar inside chat container */}
          <div
            style={{
              padding: 10,
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: 16 }}>Prompt Box</div>
            <BiEdit onClick={handleNewChat} color="black" style={{ cursor: 'pointer' }} title="New Prompt"/>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              overflowY: 'auto',
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.from === 'user' ? '#4f46e5' : '#e0e0e0',
                  color: msg.from === 'user' ? '#fff' : '#000',
                  padding: '10px 15px',
                  borderRadius: 8,
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: '#e0e0e0', padding: '10px 15px', borderRadius: 8 }}>
                ...thinking
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              display: 'flex',
              padding: 10,
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your prompt..."
              style={{
                flex: 1,
                padding: '10px 15px',
                borderRadius: 25,
                border: '1px solid #ccc',
                outline: 'none',
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              style={{
                marginLeft: 10,
                backgroundColor: '#4f46e5',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              disabled={loading}
              title="Send"
            >
              <FiSend color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
