import { createContext } from "react"

export const AppContext = createContext<AppContextProps>({
  setError: () => {},
  cache: { current: new Map() }, })

type AppContextProps = {
  setError: (error: string) => void
  cache: React.MutableRefObject<Map<string, string>>
}
