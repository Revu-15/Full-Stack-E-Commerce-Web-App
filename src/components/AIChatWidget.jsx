import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { sendAIChat } from '../services/api.js';
import { Bot, Sparkles, X, Send, ShoppingBag, Gift, Tag, Truck } from 'lucide-react';

export default function AIChatWidget() {
  const { setActiveProductModal } = useShop();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am Luxe AI, your personal shopping concierge. How can I assist your luxury discovery today?',
      products: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (customText = null) => {
    const query = customText || input;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput('');

    try {
      setLoading(true);
      const res = await sendAIChat(query);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.reply,
        products: res.products || []
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: 'Apologies, I encountered a temporary connection glitch. Please try again.', products: [] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1200 }}>
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary animate-bounce-subtle"
          style={{
            borderRadius: 'var(--radius-full)',
            padding: '0.85rem 1.25rem',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <Sparkles size={20} />
          <span>Ask Luxe AI</span>
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div
          className="glass-modal"
          style={{
            width: '380px',
            height: '520px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'var(--accent-gradient)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={22} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Luxe AI Assistant</h4>
                <span style={{ fontSize: '0.68rem', opacity: 0.9 }}>Virtual Concierge • Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: '#fff' }}>
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompts */}
          <div style={{
            padding: '0.5rem 0.75rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => handleSend('Show gifts under $150')}
              style={{ padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Gift size={12} /> Gift under $150
            </button>

            <button
              onClick={() => handleSend('What promo codes are available?')}
              style={{ padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Tag size={12} /> Promo Codes
            </button>

            <button
              onClick={() => handleSend('Recommend headphones')}
              style={{ padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <ShoppingBag size={12} /> Audio Gear
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div style={{
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '0.85rem',
                  lineHeight: 1.45
                }}>
                  {msg.text}
                </div>

                {/* Recommended Products Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {msg.products.map(p => (
                      <div
                        key={p.id}
                        onClick={() => setActiveProductModal(p)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.5rem',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer'
                        }}
                      >
                        <img src={p.image} alt={p.title} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>${p.price.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Luxe AI is typing...
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.75rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                color: 'var(--text-primary)'
              }}
            />
            <button type="submit" className="btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0.55rem' }}>
              <Send size={16} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
