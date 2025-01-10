![image](https://github.com/user-attachments/assets/22a3aee3-f9d5-4345-b71c-d9c3cd6c616a)

# InnoSpace - Room Reservation System

InnoSpace is a modern, user-friendly room reservation system designed for efficient management of meeting spaces. It integrates with LINE for easy access and notifications.

## Features

- 🏢 Browse and reserve meeting rooms
- 📅 View room availability with an interactive calendar
- 🔐 User authentication system
- 📱 Mobile-responsive design
- 🤖 LINE bot integration for reservations and status checks



![image](https://github.com/user-attachments/assets/77829592-c3ea-417a-ae01-c0f37f6e073e)


## Tech Stack

- Next.js 13 with App Router
- React
- TypeScript
- Tailwind CSS
- Supabase (Authentication and Database)
- LINE Messaging API

## Getting Started

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Set up environment variables (see \`.env.example\`)
4. Run the development server: \`npm run dev\`

## Environment Variables

Ensure you have the following environment variables set:

- \`NEXT_PUBLIC_SUPABASE_URL\`
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
- \`LINE_CHANNEL_SECRET\`
- \`LINE_CHANNEL_ACCESS_TOKEN\`
- \`NEXT_PUBLIC_LIFF_ID\`

## LINE Bot Commands

- "I want to reserve a room right now": Initiates the room reservation process
- "I want to recheck my reservation status": Allows users to check their reservations by name

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

