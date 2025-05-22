# AdventoriaMetrics

AdventoriaMetrics is a powerful and extensible Discord bot analytics and metrics platform designed to track user activity across your server. It monitors messages, reactions, and voice activity, storing the data in a database and presenting it via a sleek, modern web dashboard.

## 🚀 Features

- 📝 **Message Logging** – Track how active your members are.
- 🔁 **Reaction Tracking** – Log reactions for deeper engagement insights.
- 🔊 **Voice Activity Tracking** – Monitor how much time members spend in voice channels.
- 📊 **Modern Dashboard** – View real-time server stats with a web interface styled like Discord.
- 💾 **MySQL Integration** – Robust and scalable data storage.
- ⚙️ **Environment Config Support** – Easily manage secrets with `.env` files.

## 📸 Preview

> *(Insert screenshots or GIFs of the dashboard and bot features here)*

## 🛠️ Setup

### Prerequisites

- Node.js (v18+)
- MySQL server
- A Discord bot token
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Spolkip/AdventoriaMetrics.git
   cd AdventoriaMetrics
   ```

2. Install dependencies
  ```
  npm install
  ```

3. Set up the .env file
 ```
DISCORD_TOKEN=your_bot_token
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```

4. Initialize your MYSQL database using the schema provided in /database/schema.sql.

5. Start the bot
   ```
   node index.js
   ```
   
## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a pull request

## 📄 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

## 📬 Contact
Created by Spolkip. For questions, ideas, or feedback, feel free to open an issue or reach out.
