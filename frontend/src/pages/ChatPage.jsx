import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { chatService, tripService, joinRequestService } from '../api/services';
import { getStoredUser } from '../utils/storage';

export default function ChatPage() {
  const { tripId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [allowed, setAllowed] = useState(null);
  const stompClient = useRef(null);
  const messagesEnd = useRef(null);
  const user = getStoredUser() || {};

  useEffect(() => {
    let mounted = true;
    const boot = async () => {
      const canEnter = await checkAccess();
      if (!mounted) return;
      setAllowed(canEnter);
      if (canEnter) {
        loadMessages();
        connectWebSocket();
      }
    };
    boot();
    return () => {
      mounted = false;
      if (stompClient.current) stompClient.current.deactivate();
    };
  }, [tripId]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkAccess = async () => {
    try {
      const tripRes = await tripService.getById(tripId);
      if (tripRes.data.creatorId === user.userId) return true;
      const approvedRes = await joinRequestService.isApprovedForTrip(tripId);
      return approvedRes.data === true;
    } catch (err) {
      return false;
    }
  };

  const loadMessages = async () => {
    try {
      const res = await chatService.getMessages(tripId);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  };

  const connectWebSocket = () => {
    const wsUrl = (import.meta.env.VITE_WS_URL || 'http://localhost:8085') + '/ws/chat';
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/chat/${tripId}`, (msg) => {
          const body = JSON.parse(msg.body);
          setMessages(prev => [...prev, body]);
        });
      },
      onDisconnect: () => setConnected(false),
      reconnectDelay: 5000,
    });
    client.activate();
    stompClient.current = client;
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !connected || !allowed) return;
    stompClient.current.publish({
      destination: `/app/chat/${tripId}`,
      body: JSON.stringify({ senderId: user.userId, senderName: user.name, content: input }),
    });
    setInput('');
  };

  if (allowed === null) {
    return <div className="soft-panel py-20 text-center text-lg font-black text-[#8aa0a6]">Đang kiểm tra quyền trò chuyện...</div>;
  }

  if (!allowed) {
    return (
      <div className="mx-auto max-w-2xl">
        <section className="soft-panel p-8 text-center">
          <p className="eyebrow">chưa thể trò chuyện</p>
          <h1 className="mt-3 text-3xl font-black text-[#17313b]">Bạn cần được duyệt tham gia chuyến đi trước.</h1>
          <p className="mt-3 font-bold text-[#6b7f86]">Sau khi người tạo chuyến duyệt yêu cầu, phòng chat sẽ mở cho bạn.</p>
          <Link to={`/trips/${tripId}`} className="btn-primary mt-6">Quay lại chi tiết chuyến</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">trò chuyện nhóm</p>
          <h1 className="mt-2 text-4xl font-black text-[#17313b]">Chuyến #{tripId}</h1>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-black ${connected ? 'bg-[#eaffef] text-[#23804f]' : 'bg-[#fff0f0] text-[#c64848]'}`}>
          {connected ? 'Đã kết nối' : 'Mất kết nối'}
        </span>
      </div>

      <div className="card flex h-[72vh] min-h-[34rem] flex-col">
        <div className="border-b border-[#edf4f4] bg-white/75 p-4">
          <p className="font-black text-[#17313b]">Chốt lịch trình, chia sẻ cập nhật và giữ không khí vui vẻ trước chuyến đi.</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-[#f8fdfb]/60 p-4">
          {messages.map((msg, i) => {
            const mine = msg.senderId === user.userId;
            return (
              <div key={i} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] rounded-[1.25rem] p-3 shadow-sm ${mine ? 'bg-[#17313b] text-white' : 'bg-white text-[#17313b]'}`}>
                  <div className={`mb-1 text-xs font-black ${mine ? 'text-[#ffd166]' : 'text-[#177a78]'}`}>{msg.senderName || 'Bạn đồng hành'}</div>
                  <div className="font-bold leading-6">{msg.content}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEnd} />
        </div>
        <form onSubmit={sendMessage} className="flex gap-2 border-t border-[#edf4f4] bg-white/85 p-4">
          <input type="text" className="input-field flex-1" placeholder="Gửi một cập nhật thân thiện..." value={input} onChange={(e) => setInput(e.target.value)} />
          <button type="submit" className="btn-primary" disabled={!connected}>Gửi</button>
        </form>
      </div>
    </div>
  );
}
