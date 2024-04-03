import Chat from "./components/Chat"
import Users from "./components/Users"
import Whiteboard from "./components/Whiteboard"


function App() {


  return (
    <div className="w-full h-full flex flex-row gap-12 justify-center mt-20">
      <Users />
      <div className="flex flex-col gap-5">
      <Whiteboard width={800} height={600} />
      <Chat />
      </div>
      
    </div>
  )
}

export default App
