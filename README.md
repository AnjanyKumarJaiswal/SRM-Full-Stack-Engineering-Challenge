# TreeGuard - Full Stack Hierarchy Analysis System

## Overview
TreeGuard is a full-stack engineering challenge project designed to process and validate hierarchical graph data. The system accepts an array of parent-child relationships, constructs logical trees, detects cycles, and provides a comprehensive breakdown of the graph's structure including depths and invalid entries.

## Project Structure
The project is divided into two main components:
- **Client**: A modern React application built with Vite and TypeScript.
- **Server**: A robust Express.js backend built with TypeScript, featuring a specialized GraphService for traversal and validation.

## Architecture
### Backend Logic
The backend implements a sophisticated graph processing engine:
- **Validation**: Strict regex matching for inputs (format: A->B) and identification of self-loops.
- **Edge Management**: Automated detection of duplicate edges and enforcement of single-parent rules.
- **Traversal**: Depth-First Search (DFS) implementation for building nested tree structures.
- **Cycle Detection**: Advanced detection of recursive dependencies using path-tracking.
- **Root Identification**: Lexicographical assignment of roots for disconnected groups and pure cycles.

### Frontend Interface
The frontend provides a premium, terminal-inspired dashboard:
- **System Metrics**: Real-time display of total trees, cycles, and graph statistics.
- **Operator Identity**: Persistent display of system operator credentials.
- **Tree Visualization**: Dynamic rendering of nested JSON hierarchies in a readable card-based format.
- **Data Input**: A terminal-style interface for raw JSON array submission.

## API Specification
### Endpoint: POST /bfhl
Accepts a JSON object containing an array of strings representing graph edges.

**Request Body:**
```json
{
  "data": ["A->B", "B->C", "X->Y", "Y->X", "P->P"]
}
```

**Response Body:**
```json
{
  "user_id": "anjanykumarjaiswal_01062001",
  "email_id": "aj1899@srmist.edu.in",
  "college_roll_number": "RA2311026010006",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": {
            "C": ""
          }
        }
      },
      "depth": 3
    },
    {
      "root": "X",
      "tree": {},
      "has_cycle": true
    }
  ],
  "invalid_entries": [
    "P->P"
  ],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

## Setup and Installation
### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation Steps
1. Clone the repository.
2. Navigate to the server directory: `cd server` and run `npm install`.
3. Navigate to the client directory: `cd client` and run `npm install`.

### Running Locally
1. Start the backend: `npm run dev` in the `server` directory.
2. Start the frontend: `npm run dev` in the `client` directory.
3. Access the application at `http://localhost:5173`.

## Technologies Used
- **Frontend**: React 19, Vite, TypeScript, CSS Modules.
- **Backend**: Express, Node.js, TypeScript, TSX.
- **Typography**: Manrope Medium.
- **Design Aesthetic**: Premium Dark Mode with Terminal elements.
