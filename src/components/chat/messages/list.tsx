import type { Message } from "../../../types/base";
import LinkPreview from "./link-preview";
import UserQuery from "./user-query";
import BotReply from "./bot-reply";

import logo from '../../../assets/imgs/logo.png';

type props = {
  list: Message[]
  isTemp?: boolean
  deleteChat?: (v: string) => void
}

function List({ list = [], isTemp = false, deleteChat = () => { } }: props) {
  return list?.map(l => {
    if (l.role === "user") {
      return (
        <UserQuery
          key={l.id}
          isTemp={isTemp}
          response={l.content}
          images={l?.images || []}
          deleteChat={() => deleteChat(l._id as string)}
        />
      )
    }

    if (l.role === "web-searched") {
      return (
        <LinkPreview
          key={l.id}
          id={l.id}
          urls={l?.webSearched || []}
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
                src={logo}
                className="w-4"
              />
            </div>
            {
              [1, 2, 3, 4, 5, 6].map(p => (
                <p key={p} className="animate-msg mb-1.5 h-2 bg-white/20 rounded-sm"
                  style={{
                    width: `calc(100% - ${p * 40}px)`
                  }}
                ></p>
              ))
            }
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
        deleteChat={() => deleteChat(l._id as string)}
      />
    )
  })
}

export default List