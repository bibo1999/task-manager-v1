# TaskSync - Collaborative Task Manager 🚀

## Table of Contents
- [About The Project](#about-the-project-)
- [Built With](#built-with-)
- [Features](#features-)
- [Getting Started](#getting-started-)
- [Usage](#usage-)
- [API Reference](#api-reference-)
- [Contributing](#contributing-)
- [License](#license-)
- [Acknowledgements](#acknowrelegements-)

## About The Project ✨

TaskSync is a modern, responsive task management application designed to streamline team collaboration. It provides:

- 📊 Real-time task tracking and visualization
- 👥 Team member assignment capabilities
- 🔔 Interactive notification system
- 🌙 Light/dark theme support
- 📈 Comprehensive reporting dashboard

Perfect for agile teams, project managers, or anyone needing a clean interface to organize work efficiently.

## Built With 🛠️

- **Frontend**: 
  - ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
  - ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
  - ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

- **Libraries**:
  - ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chart.js&logoColor=white)
  - ![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=flat&logo=font-awesome&logoColor=white)

- **Storage**: `localStorage` for persistent client-side data

## Features 🌟

### Core Functionality
- **Task Management**:
  - Create, edit, and delete tasks
  - Assign tasks to team members
  - Track progress with status updates
- **Data Visualization**:
  - Interactive pie/doughnut charts for status distribution
  - Bar charts for assignee workload
  - Timeline charts for completion tracking

### Technical Highlights
- 📌 Theme switching with localStorage persistence
- 🔔 Real-time notification system
- 🧩 Modular JavaScript architecture
- 📱 Fully responsive design

## Getting Started 🏁

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge)
- Git (for development)

### Installation
1. Clone the repo:
   ```sh
   git clone https://github.com/yourusername/tasksync.git


## Usage 🖥️
### Basic Flow
Add Tasks: Click "+ Add Task" to create new items

Track Progress: Update task status as work progresses

View Reports: Navigate to Reports for visual analytics

Manage Team: Assign tasks to team members


## API Reference 📚
### Data Structure:
// Task Object
{
  id: Number,
  title: String,
  description: String,
  date: String (YYYY-MM-DD),
  priority: String ('Low'|'Medium'|'High'),
  assignee: String,
  status: String ('In Progress'|'Completed')
}

// Notification Object
{
  id: Number,
  message: String,
  type: String ('success'|'danger'|'info'),
  timestamp: ISOString,
  read: Boolean
}


## Contributing 🤝
We welcome contributions! Please follow these steps:

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

## License 📄
Distributed under the MIT License. See LICENSE for more information.

## Acknowledgements 🙏
Chart.js for powerful data visualization

Font Awesome for beautiful icons

Inspired by modern task management tools like Trello and Asana

Finally the deployment for this app you can check for at : https://task-manager-v1-seven.vercel.app/
