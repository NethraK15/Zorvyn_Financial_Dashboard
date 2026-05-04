import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CreditCard, Trash2, Edit3, Wifi, Check, X, BellRing } from "lucide-react";
import Card from "../components/ui/Card";
import useStore from "../store/useStore";
import { formatCurrency } from "../utils/helpers";

const CARD_COLORS = [
  { id: "black", name: "Obsidian Black", class: "from-slate-900 via-slate-800 to-black" },
  { id: "gold", name: "Premium Gold", class: "from-amber-200 via-yellow-400 to-amber-500" },
  { id: "indigo", name: "Deep Indigo", class: "from-indigo-600 via-purple-600 to-fuchsia-600" },
  { id: "emerald", name: "Emerald Platinum", class: "from-emerald-500 via-teal-500 to-emerald-700" },
  { id: "rose", name: "Rose Quartz", class: "from-rose-400 via-fuchsia-500 to-indigo-500" }
];

export default function WalletPage() {
  const { walletCards, addCard, deleteCard, updateCard, settings, role } = useStore();
  const [selectedCardId, setSelectedCardId] = useState(walletCards[0]?.id || null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "Jane Doe",
    number: "**** **** **** 0000",
    expiry: "12/28",
    network: "visa", // visa, mastercard
    color: CARD_COLORS[0].class,
    balance: 0,
    limit: 10000,
    type: "Credit"
  });

  const selectedCard = walletCards.find(c => c.id === selectedCardId) || walletCards[0];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addCard({ ...formData, balance: Number(formData.balance), limit: Number(formData.limit) });
    setIsAdding(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateCard(selectedCard.id, { ...formData, balance: Number(formData.balance), limit: Number(formData.limit) });
    setIsEditing(false);
  };

  const openAdd = () => {
    setFormData({ name: "Jane Doe", number: "**** **** **** ", expiry: "", network: "visa", color: CARD_COLORS[0].class, balance: 0, limit: 10000, type: "Credit" });
    setIsAdding(true);
  };

  const openEdit = () => {
    setFormData({ ...selectedCard });
    setIsEditing(true);
  };

  const cardVariants = {
    selected: { y: 0, scale: 1, zIndex: 10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", rotateX: 0 },
    unselected: (index) => ({
      y: index * 45 + 160,
      scale: 0.9 - index * 0.05,
      zIndex: 10 - index,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
      rotateX: 10
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-10 space-y-8 max-w-[1400px] mx-auto min-h-screen"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Digital <span className="text-indigo-500">Wallet</span></h1>
          <p className="text-sm font-bold text-slate-500 tracking-widest mt-1">Manage your centralized liquidity</p>
        </div>
        {role !== "viewer" && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAdd}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm tracking-wider uppercase shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Card
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        {/* Wallet Deck View */}
        <div className="lg:col-span-5 relative h-[450px] sm:h-[500px] lg:h-[600px] perspective-1000">
          <AnimatePresence>
            {walletCards.map((card, idx) => {
              const isSelected = card.id === selectedCardId;
              const unselectedIndex = walletCards.filter(c => c.id !== selectedCardId).findIndex(c => c.id === card.id);
              
              return (
                <motion.div
                  key={card.id}
                  layout
                  custom={unselectedIndex}
                  variants={cardVariants}
                  initial="unselected"
                  animate={isSelected ? "selected" : "unselected"}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`absolute w-full aspect-[1.586/1] rounded-3xl p-6 bg-gradient-to-br ${card.color} text-white cursor-pointer transition-transform duration-500 will-change-transform border border-white/10`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <Wifi className="w-8 h-8 opacity-70 rotate-90" />
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{card.type}</span>
                        <div className="font-black italic text-xl mt-1 opacity-90">{card.network === "visa" ? "VISA" : "Mastercard"}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Chip icon */}
                      <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 opacity-90 shadow-sm flex items-center justify-center overflow-hidden">
                        <div className="w-full h-[1px] bg-black/20 absolute"></div>
                        <div className="h-full w-[1px] bg-black/20 absolute"></div>
                      </div>
                      <p className="font-mono text-2xl tracking-[0.2em] font-medium text-white/95 text-shadow-sm">{card.number}</p>
                      
                      <div className="flex justify-between items-end">
                        <div className="uppercase">
                          <p className="text-[8px] tracking-[0.2em] opacity-60 mb-1">Cardholder Name</p>
                          <p className="font-bold tracking-widest text-sm">{card.name}</p>
                        </div>
                        <div className="uppercase text-right">
                          <p className="text-[8px] tracking-[0.2em] opacity-60 mb-1">Valid Thru</p>
                          <p className="font-bold tracking-widest text-sm">{card.expiry}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {/* Add Card Visual Slot */}
            {!isAdding && !isEditing && role !== "viewer" && (
              <motion.div
                key="add-card-slot"
                layout
                custom={walletCards.length}
                variants={cardVariants}
                initial="unselected"
                animate={walletCards.length === 0 ? "selected" : "unselected"}
                onClick={openAdd}
                className={`absolute w-full aspect-[1.586/1] rounded-3xl p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 cursor-pointer transition-colors duration-300 hover:border-indigo-500 hover:text-indigo-500 flex flex-col items-center justify-center`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Plus className="w-10 h-10 mb-2 opacity-80" />
                <p className="font-bold uppercase tracking-widest text-sm">Add New Card</p>
              </motion.div>
            )}
          </AnimatePresence>

          {walletCards.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/50">
              <CreditCard className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-bold uppercase tracking-widest mb-2">Wallet Empty</p>
              <p className="text-sm font-medium opacity-80">Add your first card to begin tracking balances and analytics.</p>
            </div>
          )}
        </div>

        {/* Card Details & Controls */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedCard && !isAdding && !isEditing ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="p-8 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Current Balance</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">
                      {formatCurrency(selectedCard.balance, settings.currency)}
                    </p>
                    {selectedCard.limit && (
                      <p className="text-xs font-bold text-slate-500 mt-2">
                        {formatCurrency(selectedCard.limit - selectedCard.balance, settings.currency)} available of {formatCurrency(selectedCard.limit, settings.currency)} limit
                      </p>
                    )}
                  </div>
                  
                  {role !== "viewer" && (
                    <div className="flex gap-3">
                      <button 
                        onClick={openEdit}
                        className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => {
                          deleteCard(selectedCard.id);
                          setSelectedCardId(walletCards[0]?.id !== selectedCard.id ? walletCards[0]?.id : walletCards[1]?.id);
                        }}
                        className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card className="p-6 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <BellRing className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">Alerts & Notifications</p>
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Active</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">You will receive notifications before the due date and for large transactions exceeding your threshold.</p>
                  </Card>

                  <Card className="p-6 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">Card Status</p>
                        <p className="text-[10px] uppercase font-black tracking-widest text-emerald-500">Active & Verified</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">This card is fully synced with Artha. Recent transactions are automatically imported.</p>
                  </Card>
                </div>
              </motion.div>
            ) : (isAdding || isEditing) ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="p-8 border-none bg-white dark:bg-slate-950 shadow-2xl relative overflow-hidden">
                  <button onClick={() => { setIsAdding(false); setIsEditing(false); }} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-black uppercase mb-8">{isAdding ? "Provision New Card" : "Update Card Details"}</h2>
                  
                  <form onSubmit={isAdding ? handleAddSubmit : handleEditSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Card Number</label>
                        <input required value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-mono focus:ring-2 focus:ring-indigo-500/50 outline-none" placeholder="**** **** **** ****" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Cardholder Name</label>
                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Valid Thru</label>
                        <input required value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Current Balance</label>
                        <input type="number" step="0.01" required value={formData.balance} onChange={e => setFormData({...formData, balance: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Credit Limit (0 if None)</label>
                        <input type="number" value={formData.limit} onChange={e => setFormData({...formData, limit: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Network</label>
                        <select value={formData.network} onChange={e => setFormData({...formData, network: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none">
                          <option value="visa">VISA</option>
                          <option value="mastercard">Mastercard</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Type</label>
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none">
                          <option value="Credit">Credit</option>
                          <option value="Debit">Debit</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Card Design Skin</label>
                      <div className="flex gap-3">
                        {CARD_COLORS.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setFormData({...formData, color: c.class})}
                            title={c.name}
                            className={`w-12 h-12 rounded-full cursor-pointer bg-gradient-to-br transition-all border-4 ${c.class} ${formData.color === c.class ? 'border-white dark:border-slate-800 scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black text-sm uppercase py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-colors">
                        {isAdding ? "Save & Deploy Card" : "Commit Changes"}
                      </button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
