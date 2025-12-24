"use client";

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VendorCTASection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        <div className="relative rounded-2xl overflow-hidden bg-gray-900 px-6 py-16 md:py-20 md:px-16 text-center">
          
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1573164574230-db1d5e960238?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Business professional" 
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-[#09090b]/10"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
            


            {/* Main Heading */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[30px] font-bold text-white mb-4 tracking-tight leading-tight"
            >
              Bring your business to SynkkAfrica.
            </motion.h2>

            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-[14px] mb-8 font-light max-w-xl mx-auto"
            >
              Take control of your business workflow. Join thousands of vendors growing with Synkafrica.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link 
                href="/business" 
                className="w-full sm:w-auto px-8 py-3 bg-[#E05D3D] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#c94e30] transition-colors flex items-center justify-center whitespace-nowrap shadow-lg shadow-[#E05D3D]/20"
              >
                List your business
              </Link>
              
              <button className="w-full sm:w-auto px-8 py-3 bg-[#383838] text-white text-[14px] border border-gray-700 font-medium rounded-[6px] hover:bg-[#4a4a4a] hover:border-gray-600 transition-all flex items-center justify-center gap-2 whitespace-nowrap group">
                Learn more
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
