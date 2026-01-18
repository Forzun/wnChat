'use client';

import React from "react"
import { useState, useEffect, useRef } from 'react';
import { Copy, Send, Trash2, ImageIcon, Users, Lock, Clock } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  image?: string;
  isOwn: boolean;
  timestamp: Date;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: 'No messages yet, start the conversation.',
      isOwn: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [roomId] = useState('fb7Miz6aMzlrW5uoXznc_');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isActive, setIsActive] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = () => {
    if ((input.trim() || selectedImage) && isActive) {
      if (messages.length === 1 && messages[0].text === 'No messages yet, start the conversation.') {
        setMessages([]);
      }
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input,
        image: selectedImage || undefined,
        isOwn: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput('');
      setSelectedImage(null);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDestroy = () => {
    if (confirm('Destroy this room? This cannot be undone.')) {
      setIsActive(false);
    }
  };

  const getTimerColor = () => {
    if (timeLeft > 300) return '#10b981';
    if (timeLeft > 60) return '#fbbf24';
    return '#ff8c42';
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-mono dark">
      {/* Header */}
      <header className="border-b border-accent/15 bg-gradient-to-b from-secondary/60 to-background/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 md:px-8 py-5 gap-4 md:gap-6">
          {/* Room ID Section */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs tracking-widest text-muted-foreground uppercase">Room ID</span>
              <div className="flex items-center gap-2">
                <code className="text-accent font-bold text-sm md:text-base truncate">{roomId}</code>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 hover:bg-accent/15 rounded transition-all duration-200 flex-shrink-0 group"
                  title="Copy room ID"
                >
                  <Copy className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </button>
                {copied && <span className="text-accent text-xs animate-pulse">Copied</span>}
              </div>
            </div>
          </div>

          {/* Timer Section */}
          <div className="flex flex-col items-center gap-1 px-4">
            <span className="text-xs tracking-widest text-muted-foreground uppercase">Self-Destruct</span>
            <div className="text-2xl md:text-3xl font-bold" style={{ color: getTimerColor() }}>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Destroy Button */}
          <button
            onClick={handleDestroy}
            disabled={!isActive}
            className="px-3 md:px-4 py-2.5 bg-accent/15 hover:bg-accent/25 disabled:opacity-40 text-accent rounded border border-accent/40 hover:border-accent/60 text-xs md:text-sm font-bold uppercase tracking-wide transition-all duration-200 flex items-center gap-2 flex-shrink-0 group"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Destroy</span>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-12 py-8 scroll-smooth">
        <div className="space-y-4">
          {messages.length === 0 || (messages.length === 1 && messages[0].text === 'No messages yet, start the conversation.') ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="text-5xl mb-4 text-accent font-bold opacity-50">›</div>
                <p className="text-muted-foreground text-lg">
                  No messages yet, start the conversation.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex items-start gap-2 group">
                {/* Message prompt */}
                <div className="text-accent font-bold text-base pt-1 flex-shrink-0">›</div>

                {/* Message content */}
                <div className="flex flex-col gap-1">
                  <div className="inline-block">
                    <div className="px-3 md:px-4 py-2 rounded-lg border transition-all duration-200 bg-card border-accent/30 text-foreground">
                      {message.image && (
                        <img
                          src={message.image || "/placeholder.svg"}
                          alt="Message image"
                          className="max-w-sm rounded mb-2 border border-accent/30"
                        />
                      )}
                      {message.text && <p className="break-words text-sm leading-relaxed">{message.text}</p>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="border-t border-accent/15 bg-gradient-to-t from-secondary/60 to-background/20 backdrop-blur-md sticky bottom-0 p-4 md:p-6">
        <div className="flex gap-2 md:px-8">
          <div className="text-accent font-bold text-base pt-3 flex-shrink-0">›</div>
          <div className="flex-1 flex flex-col gap-3 md:gap-2">
            {selectedImage && (
              <div className="relative inline-block max-w-xs">
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-xs rounded border border-accent/40 bg-secondary/40"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-3 md:gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isActive ? 'Type message...' : 'Room is closed'}
                disabled={!isActive}
                className="flex-1 bg-input border border-accent/20 focus:border-accent/50 text-foreground placeholder-muted-foreground rounded px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 disabled:bg-secondary/40 transition-all duration-200 font-mono"
                rows={1}
              />
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!isActive}
                  className="px-3 py-3 bg-accent/20 hover:bg-accent/30 disabled:opacity-40 text-accent rounded border border-accent/40 transition-all duration-200 flex items-center gap-2 group hover:border-accent/60"
                  title="Upload image"
                >
                  <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!isActive || (!input.trim() && !selectedImage)}
                  className="px-4 py-3 bg-accent hover:bg-accent/90 disabled:opacity-40 text-background rounded font-bold transition-all duration-200 flex items-center gap-2 group hover:shadow-lg hover:shadow-accent/20"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
          aria-label="Upload image"
        />
      </div>


    </div>
  );
}
