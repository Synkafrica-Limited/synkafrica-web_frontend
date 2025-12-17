"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load order from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedOrder = localStorage.getItem('currentOrder');
        if (savedOrder) {
          setCurrentOrder(JSON.parse(savedOrder));
        }
      } catch (error) {
        console.error('Failed to load order from storage:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Save order to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      if (currentOrder) {
        localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
      } else {
        localStorage.removeItem('currentOrder');
      }
    }
  }, [currentOrder, isLoading]);

  const createOrder = (orderData) => {
    const order = {
      ...orderData,
      orderId: orderData.orderId || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    setCurrentOrder(order);
    return order;
  };

  const updateOrder = (updates) => {
    setCurrentOrder(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  };

  const clearOrder = () => {
    setCurrentOrder(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentOrder');
    }
  };

  return (
    <OrderContext.Provider value={{
      currentOrder,
      isLoading,
      createOrder,
      updateOrder,
      clearOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
