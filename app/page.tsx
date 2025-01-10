import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock data for rooms
const rooms = [
  { id: 1, name: "AIS 5G GARAGE", capacity: 10, image: "https://www.eng.chula.ac.th/wp-content/uploads/2022/08/05-2-1024x683.jpg" },
  { id: 2, name: "Room 601", capacity: 40, image: "https://www.eng.chula.ac.th/wp-content/uploads/2020/10/4-1024x769.jpg" },
  { id: 3, name: "Room 602", capacity: 50, image: "https://www.intaniamagazine.com/wp-content/uploads/2022/12/%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1-12-e1669963399174.jpg" },
]

export default function Home() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Innovative Spaces for Innovative Minds
      </h1>
      <p className="text-xl text-center mb-12 text-gray-600">
        Book your perfect meeting room and unleash your team's potential
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div key={room.id} className="group">
            <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="relative h-48 bg-gray-200">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-lg font-semibold">View Details</p>
                </div>
              </div>
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600">
                <CardTitle className="text-xl text-white">{room.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-700">Capacity: {room.capacity} people</p>
              </CardContent>
              <CardFooter>
                <Link href={`/room/${room.id}`} passHref className="w-full">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                    Book Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

