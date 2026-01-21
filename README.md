# Contract Management Platform

## Description
A simple contract management platform built using React that allows users to create reusable contract blueprints, generate contracts from those blueprints, and manage the contract lifecycle.

Live Demo:

https://resonant-tartufo-146ab0.netlify.app/

## Features
- Create contract blueprints with configurable fields
- Supported field types: Text, Date, Signature, Checkbox
- Generate contracts from blueprints
- Controlled contract lifecycle:
  Created → Approved → Sent → Signed → Locked
- Ability to revoke contracts
- Contract listing dashboard with status-based filtering

## Tech Stack
- React
- JavaScript
- CSS
- Local state management (mocked persistence)

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   
2. Navigate to the project folder:
   cd contract-management-platform

3. Install dependensies:
   npm install

4. Start the application
   npm start

5. Open the browser at:
   http://localhost:3000

## Architecture and Design Decisions
- Component-based architecture using React
- Separate components for Blueprints, Contracts, and Dashboard
- Centralized state management using React hooks
- Mocked local data storage (no backend required)
## Assumptions and Limitations
- Data is stored locally and resets on page refresh
- No backend or authentication implemented
- Basic UI focusing on clarity over visual polish

  
   
