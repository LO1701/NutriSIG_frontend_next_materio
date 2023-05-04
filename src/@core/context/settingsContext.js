// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** ThemeConfig Import
import themeConfig from '../../configs/themeConfig'

// Setiings default
const initialSettings = {
  themeColor: 'primary',
  mode: themeConfig.mode,
  contentWidth: themeConfig.contentWidth
}

// ** Create Context
export const SettingsContext = createContext({
  saveSettings: () => null,
  settings: initialSettings
})

export const restoreSettings = () => {
  let settings = null;

  try {
    const storeData = window.localStorage.getItem('settings')
    
    if(storeData)
      settings = JSON.parse(storeData)

  } catch (error) {
    console.error(error)    
  }

  return settings
}

export const storeSettings = (settings) => {
  window.localStorage.setItem('settings', JSON.stringify(settings))
}

export const SettingsProvider = ({ children }) => {
  // ** State
  const [settings, setSettings] = useState({ ...initialSettings })

  const saveSettings = updatedSettings => {
    setSettings(updatedSettings)
    storeSettings(updatedSettings)
  }

  useEffect(() => {
    const RestoreSettings = restoreSettings()

    if(RestoreSettings) 
      setSettings(restoreSettings)
  }, [])

  return <SettingsContext.Provider value={{ settings, saveSettings }}>{children}</SettingsContext.Provider>
}

export const SettingsConsumer = SettingsContext.Consumer

export default SettingsContext
