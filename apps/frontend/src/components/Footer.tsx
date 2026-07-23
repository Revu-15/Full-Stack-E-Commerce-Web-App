'use client';

import React from 'react';
import { ShoppingBag, ShieldCheck, Mail, ArrowRight, Globe, Share2, Send, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-white/10 text-gray-400 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        {/* About NexCart */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShoppingBag className="w-4 h-4 text-black font-bold" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight nex-text-gradient">NexCart</span>
          </div>
          <p className="text-xs leading-relaxed font-light">
            About NexCart: Your next-generation everything store. Inspired by Amazon, Flipkart, and Apple to deliver fast 1-day shipping and 100% verified products.
          </p>
          <div className="flex items-center gap-3 pt-2 text-gray-400">
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-amber-400 transition-colors"><Globe className="w-4 h-4" /></a>
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-amber-400 transition-colors"><Share2 className="w-4 h-4" /></a>
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-amber-400 transition-colors"><Send className="w-4 h-4" /></a>
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-amber-400 transition-colors"><MessageCircle className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Customer Service & Contact */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Contact & Support</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-amber-300 transition-colors">Help Center & FAQ</a></li>
            <li><a href="#" className="hover:text-amber-300 transition-colors">Contact Support: support@nexcart.com</a></li>
            <li><a href="#" className="hover:text-amber-300 transition-colors">NexPrime Membership</a></li>
            <li><a href="#" className="hover:text-amber-300 transition-colors">Track Your Package</a></li>
          </ul>
        </div>

        {/* Legal & Policy */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Legal & Privacy</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-amber-300 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-amber-300 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-amber-300 transition-colors">Return & Refund Policy</a></li>
            <li><a href="#" className="hover:text-amber-300 transition-colors">Cookie Preferences</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">NexCart Newsletter</h4>
          <p className="text-xs font-light">Get instant alerts for Today's Deals & Lightning Sales.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter email address..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button className="nex-btn-gradient p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
              <ArrowRight className="w-4 h-4 text-black font-bold" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <p>© 2026 NexCart Inc. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built with Next.js 15, TypeScript & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};
