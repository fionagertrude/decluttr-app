📱 Decluttr App - Responsible Disposal Platform
📋 Table of Contents
Overview

Features

Tech Stack

Project Structure

Installation

Configuration

Running the App

Testing

API Documentation

Database Schema

Key Flows

Contributing

License

🌟 Overview
Decluttr is a full-stack mobile-first web application that enables users to responsibly dispose of unwanted items through three distinct channels: selling, donating, or recycling. The platform connects people who want to declutter with those who can give their items a second life, while ensuring secure transactions through an escrow system and promoting environmental responsibility.

🎯 Purpose
For Sellers: Earn money from unused items with secure payment protection

For Donors: Give items to charity with transparency and impact tracking

For Recyclers: Ensure responsible disposal of items that can't be reused

For Buyers: Find quality second-hand items with purchase protection

✨ Features
Core Features
User Authentication: Secure signup/login with email/password

Smart Posting Wizard: Guided 4-step process for listing items

Multi-disposition Options: Choose between Sell, Donate, or Recycle

Photo Management: Upload up to 10 photos with 3-photo minimum requirement

Secure Escrow System: Funds held securely until buyer confirms receipt

M-Pesa Integration: Mobile money payments with STK push

Real-time Chat: Direct messaging between buyers and sellers

Advanced Search & Filters: Find items by category, price, location, and condition

User Features
For Buyers: Browse listings, save favorites, make offers, purchase securely

For Sellers: Manage listings, track sales, communicate with buyers

For Donors: Schedule pickups, track donation impact

Admin Panel: Manage donation batches, charity coordination, platform oversight

Safety Features
Escrow payment protection

User verification system

Transaction history

Dispute resolution framework

Rating and review system

🛠 Tech Stack
Frontend
Framework: React 18 with Vite

Routing: React Router v6

State Management:

TanStack Query for server state

Zustand for local state

Styling: Tailwind CSS with custom emerald theme

UI Components: Headless UI + Heroicons

Forms: React Hook Form

HTTP Client: Axios with interceptors

Backend (Recommended)
Database: Supabase (PostgreSQL)

Authentication: Supabase Auth

Storage: Supabase Storage for images

API: Supabase Edge Functions / Custom Node.js API

Real-time: Supabase Realtime for chat

Payment Integration
M-Pesa: Safaricom API for Kenyan mobile payments

Escrow System: Custom implementation with payment holds

Testing & Quality
Unit Testing: Vitest + React Testing Library

E2E Testing: Playwright

Code Quality: ESLint + Prettier

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
