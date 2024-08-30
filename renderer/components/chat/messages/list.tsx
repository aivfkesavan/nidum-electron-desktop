import UserQuery from "./user-query";
import BotReply from "./bot-reply";

type props = {
  list: {
    id: string
    role: "user" | "assistant" | "loading"
    content: string
  }[]
  isTemp?: boolean
  deleteChat?: (v: string) => void
}

function List({ list = [], isTemp = false, deleteChat = () => { } }: props) {
  return list?.map((l: any) => {
    if (l.role === "user") {
      return (
        <UserQuery
          key={l.id}
          isTemp={isTemp}
          response={l.content}
          deleteChat={() => deleteChat(l.id)}
        />
      )
    }

    if (l.role === "loading") {
      return (
        <div
          key={l.id}
          className="mb-6 group"
        >
          <div className="ml-9 py-2 relative">
            <div className="dc size-7 absolute top-1 -left-9 border rounded-full">
              <img
                alt=""
                src="/logo.png"
                className="w-4"
              />
            </div>
            <span className="mr-1 text-xs">Thinking</span>
            <span className="animate-ping text-2xl leading-3">.</span>
            <span className="animate-ping delay-75 text-2xl leading-3">.</span>
            <span className="animate-ping delay-100 text-2xl leading-3">.</span>
          </div>
        </div>
      )
    }

    return (
      <BotReply
        key={l.id}
        id={l.id}
        isTemp={isTemp}
        response={l.content}
        deleteChat={() => deleteChat(l.id)}
      />
    )
  })
}

export default List