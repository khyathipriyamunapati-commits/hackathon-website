import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/common/EmptyState';
import { 
  MessageSquare, 
  Send, 
  MapPin, 
  User, 
  Clock, 
  CheckCheck, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const convParam = searchParams.get('conv');

  const { currentUser, conversations, messages, sendMessage } = useApp();

  // Find user's eligible conversations (where user is tourist or guide or admin)
  const userConversations = conversations.filter(
    (c) =>
      c.touristId === currentUser.id ||
      c.guideId === currentUser.id ||
      currentUser.role === 'admin'
  );

  const [activeConvId, setActiveConvId] = useState<string>(
    convParam || (userConversations[0]?.id || '')
  );
  const [inputMessage, setInputMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeConv = userConversations.find((c) => c.id === activeConvId);

  // Active messages
  const activeMessages = activeConv
    ? messages.filter((m) => m.conversationId === activeConv.id)
    : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!inputMessage.trim()) {
      setErrorMessage('Please type a message before sending.');
      return;
    }

    if (!activeConv) {
      setErrorMessage('Please select a conversation first.');
      return;
    }

    const receiverId = currentUser.role === 'tourist' ? activeConv.guideId : activeConv.touristId;
    const receiverName = currentUser.role === 'tourist' ? activeConv.guideName : activeConv.touristName;

    const res = sendMessage(activeConv.bookingId || '', receiverId, receiverName, inputMessage);
    if (res.success) {
      setInputMessage('');
    } else {
      setErrorMessage(res.message || 'Failed to send message.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          In-App Messenger
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Traveler & Guide Communications
        </h1>
        <p className="text-xs text-slate-500">
          Coordinate timing, temple darshan requirements, elder assistance, and pickup points safely.
        </p>
      </div>

      {userConversations.length === 0 ? (
        <EmptyState
          title="No Conversations Yet"
          description="You don't have any active conversations. Start by requesting a booking with a verified guide!"
          icon={MessageSquare}
          actionText="Find Guides"
          onAction={() => (window.location.href = '/guides')}
        />
      ) : (
        <div className="bg-white rounded-3xl shadow-card border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[680px]">
          
          {/* Left Column: Conversation List (1 Col) */}
          <div className="border-b md:border-b-0 md:border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
            <div className="p-4 border-b border-slate-200 bg-white">
              <h2 className="text-sm font-bold text-slate-900">Conversations</h2>
              <span className="text-[11px] text-slate-400">
                Logged in as <strong>{currentUser.fullName}</strong> ({currentUser.role})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {userConversations.map((conv) => {
                const isSelected = conv.id === activeConvId;
                const otherPartyName = currentUser.role === 'tourist' ? conv.guideName : conv.touristName;
                const otherPartyRole = currentUser.role === 'tourist' ? 'Local Guide' : 'Tourist';

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setErrorMessage(null);
                    }}
                    className={`w-full text-left p-4 transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-teal-50/80 border-l-4 border-teal-600'
                        : 'hover:bg-slate-100/70 bg-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 shadow-xs text-xs">
                      {otherPartyName.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{otherPartyName}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <span className="text-[10px] text-teal-600 font-semibold block">
                        {conv.destinationName} • {otherPartyRole}
                      </span>

                      <p className="text-xs text-slate-500 truncate mt-1">
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Chat Window (2 Cols) */}
          <div className="md:col-span-2 flex flex-col h-full bg-white">
            {activeConv ? (
              <>
                {/* Chat Top Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {(currentUser.role === 'tourist' ? activeConv.guideName : activeConv.touristName).charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {currentUser.role === 'tourist' ? activeConv.guideName : activeConv.touristName}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-teal-600" />
                        Trip to {activeConv.destinationName}
                        {activeConv.bookingId && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono ml-1">
                            Ref: #{activeConv.bookingId.slice(-6)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                    Active Session
                  </span>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
                  {activeMessages.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-xs">
                      No messages yet in this conversation. Say hello to introduce yourself!
                    </div>
                  ) : (
                    activeMessages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1 px-1">
                            <span className="text-[10px] font-bold text-slate-600">
                              {isMe ? 'You' : msg.senderName}
                            </span>
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-200/60 text-slate-600">
                              {msg.senderRole}
                            </span>
                            <span className="text-[9px] text-slate-400">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div
                            className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                              isMe
                                ? 'bg-teal-600 text-white rounded-tr-none'
                                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="px-4 py-2 bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2 border-t border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Chat Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message to coordinate trip details..."
                    className="flex-1 text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500 focus:bg-white transition"
                  />

                  <button
                    type="submit"
                    className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                Select a conversation on the left to start messaging.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
