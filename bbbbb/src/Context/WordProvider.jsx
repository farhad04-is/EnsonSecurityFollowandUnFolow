import React, { createContext, useState } from 'react'

export const WordContext=createContext()
function WordProvider({children}) {

    const [word,setword]=useState("")

   let value={
    word,setword
   }

     
  return (
    <WordContext.Provider value={value}>
      {children}
    </WordContext.Provider>
  )
}

export default WordProvider