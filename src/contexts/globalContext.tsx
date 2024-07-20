import React, { createContext, useState } from 'react'
import Preference, { IPreference } from '@/models/Preference'
import User, { IUser } from '@/models/User'
import { useMount } from 'ahooks'

interface IGlobalContext {
  preference?: IPreference
  user?: IUser
  updateCapacity: () => void // 更新全局容量
}

export const GlobalContext = createContext<IGlobalContext>(null as any)

const GlobalContextProvider: React.FC = ({ children }) => {
  const [preference, setPreference] = useState<Preference>()
  const [user, setUser] = useState<User>()

  // todo 更新全局容量
  const updateCapacity = () => {}

  useMount(async () => {
    // 初始化preference
    const preference = await Preference.httpFetch().then((res) => new Preference(res))
    console.log('preference', preference)
    setPreference(preference)
    preference.updateTitleAndFavicon()
  })

  return (
    <GlobalContext.Provider
      value={{
        user,
        preference,
        updateCapacity,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalContextProvider
