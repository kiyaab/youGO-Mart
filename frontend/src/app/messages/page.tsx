'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Conversation, Message } from '@/types';
import {
  MessageSquare,
  Send,
  User,
  Clock,
  Tag,
  ShieldCheck,
  CheckCheck,
  ArrowLeft,
} from 'lucide-react';

function MessagesContent() {
  const searchParams = useSearchParams();
  const initialConvId = searchParams?.get('id');
  const { user, isAuthenticated } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<number | null>(
    initialConvId ? Number(initialConvId) : null
  );
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.messaging.getConversations();
        setConversations(data || []);
        if (data && data.length > 0 && !selectedConvId) {
          setSelectedConvId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
  }, [isAuthenticated, selectedConvId]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConvId) return;
    async function loadThread() {
      try {
        const res = await api.messaging.getConversation(selectedConvId as number);
        setActiveConversation(res.conversation);
        setMessages(res.messages || []);
      } catch (err) {
        console.error('Failed to load thread:', err);
      }
    }
    loadThread();

    // Set up light polling every 5s for live updates
    const interval = setInterval(loadThread, 5000);
    return () => clearInterval(interval);
  }, [selectedConvId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !newText.trim()) return;

    const contentToSend = newText.trim();
    setNewText('');
    setSending(true);

    try {
      const sent = await api.messaging.sendMessage(selectedConvId, contentToSend);
      setMessages((prev) => [...prev, sent]);
    } catch {
      alert('Failed to deliver message.');
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <div className="yg-card p-5 max-w-md mx-auto rounded-4">
          <MessageSquare size={44} className="text-warning mb-3" />
          <h4 className="fw-bold">Sign In to View Messages</h4>
          <p className="text-muted small mb-4">
            Direct buyer-to-seller messaging requires authentication. You can also use the demo switcher to try as Buyer or Seller.
          </p>
          <Link href="/auth/login" className="btn-orange px-4 py-2">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        <div className="mb-3">
          <h1 className="h3 fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            Inbox & Messages
          </h1>
          <p className="text-muted small m-0">
            Direct buyer and seller communications for listings across Ethiopia.
          </p>
        </div>

        <div className="yg-card rounded-4 shadow-sm overflow-hidden" style={{ minHeight: '600px' }}>
          <div className="row g-0 h-100" style={{ minHeight: '600px' }}>
            {/* Left: Conversation List */}
            <div
              className={`col-md-4 border-end ${selectedConvId ? 'd-none d-md-block' : 'd-block'}`}
              style={{ maxHeight: '650px', overflowY: 'auto' }}
            >
              <div className="p-3 border-bottom bg-light fw-bold small text-muted text-uppercase">
                Conversations ({conversations.length})
              </div>

              {loading ? (
                <div className="p-4 text-center text-muted small">Loading inbox...</div>
              ) : conversations.length > 0 ? (
                <div className="list-group list-group-flush">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      type="button"
                      className={`list-group-item list-group-item-action p-3 border-bottom text-start ${
                        selectedConvId === conv.id ? 'bg-warning bg-opacity-10' : ''
                      }`}
                      onClick={() => setSelectedConvId(conv.id)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="position-relative rounded-2 overflow-hidden flex-shrink-0"
                          style={{ width: '48px', height: '48px', backgroundColor: '#E2E8F0' }}
                        >
                          {conv.listing_image ? (
                            <Image src={conv.listing_image} alt="" fill style={{ objectFit: 'cover' }} />
                          ) : (
                            <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                              <Tag size={18} />
                            </div>
                          )}
                        </div>

                        <div className="flex-grow-1 overflow-hidden">
                          <div className="d-flex justify-content-between align-items-baseline mb-1">
                            <span className="fw-bold small text-truncate" style={{ maxWidth: '140px' }}>
                              {conv.other_party?.name || 'User'}
                            </span>
                            {conv.unread_count > 0 && (
                              <span className="badge bg-warning text-dark rounded-pill">
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                          <div className="small text-truncate text-muted" style={{ fontSize: '0.78rem' }}>
                            {conv.listing_title || 'Listing Discussion'}
                          </div>
                          {conv.last_message && (
                            <div className="small text-truncate text-secondary" style={{ fontSize: '0.75rem' }}>
                              {conv.last_message.content}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-5 text-center text-muted small">
                  No conversations yet. Open any listing and click "Send In-App Message".
                </div>
              )}
            </div>

            {/* Right: Active Chat Area */}
            <div className={`col-md-8 d-flex flex-column ${!selectedConvId ? 'd-none d-md-flex' : 'd-flex'}`}>
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light">
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-neutral d-md-none me-1"
                        onClick={() => setSelectedConvId(null)}
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div
                        className="rounded-circle bg-warning text-white fw-bold d-flex align-items-center justify-content-center"
                        style={{ width: '38px', height: '38px' }}
                      >
                        {activeConversation.other_party?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="fw-bold small">
                          {activeConversation.other_party?.name || 'Marketplace User'}
                        </div>
                        <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                          Regarding:{' '}
                          <strong>{activeConversation.listing_title}</strong> (
                          {Number(activeConversation.listing_price || 0).toLocaleString()} {activeConversation.listing_currency})
                        </div>
                      </div>
                    </div>

                    {activeConversation.listing && (
                      <Link
                        href={`/listings/${activeConversation.listing}`}
                        className="btn btn-sm btn-neutral d-none d-sm-inline-flex"
                      >
                        View Ad
                      </Link>
                    )}
                  </div>

                  {/* Message History Feed */}
                  <div
                    className="flex-grow-1 p-3 overflow-y-auto d-flex flex-column gap-3"
                    style={{ maxHeight: '480px', minHeight: '380px' }}
                  >
                    {/* Safety Hint Pill */}
                    <div className="alert alert-warning py-2 px-3 small text-center mb-2 mx-auto" style={{ maxWidth: '520px', fontSize: '0.78rem' }}>
                      <ShieldCheck size={14} className="d-inline me-1" />
                      <strong>Safety Reminder:</strong> Do not wire money or make advance deposits. Inspect products in safe, public areas in Addis Ababa or your local town.
                    </div>

                    {messages.map((m) => {
                      const isMe = m.is_me;
                      return (
                        <div
                          key={m.id}
                          className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}
                        >
                          <div
                            className="p-3 rounded-4"
                            style={{
                              maxWidth: '75%',
                              backgroundColor: isMe ? '#F97316' : 'var(--mist)',
                              color: isMe ? '#FFFFFF' : 'var(--text-main)',
                              border: isMe ? 'none' : '1px solid var(--border-color)',
                              borderBottomRightRadius: isMe ? '4px' : '16px',
                              borderBottomLeftRadius: isMe ? '16px' : '4px',
                            }}
                          >
                            <div className="small" style={{ lineHeight: 1.5 }}>
                              {m.content}
                            </div>
                          </div>
                          <div
                            className="text-muted px-1 mt-1 d-flex align-items-center gap-1"
                            style={{ fontSize: '0.68rem' }}
                          >
                            <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isMe && <CheckCheck size={12} className="text-muted" />}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Composer Input */}
                  <form onSubmit={handleSendMessage} className="p-3 border-top bg-light">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Write a message to arrange purchase, inspection..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        className="btn-orange px-4"
                        disabled={sending || !newText.trim()}
                      >
                        <Send size={16} /> Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 p-5 text-center text-muted">
                  <MessageSquare size={48} className="mb-2 text-muted opacity-50" />
                  <h6 className="fw-bold">Select a conversation</h6>
                  <p className="small m-0">Choose a chat from the left panel to read and send messages.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="container py-5 text-center">Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
