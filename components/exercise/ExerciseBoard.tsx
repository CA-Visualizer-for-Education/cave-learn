'use client'
// components/exercise/ExerciseBoard.tsx
// The main body of the exercise page.
import ExerciseBoardSubheader from "./ExerciseBoardSubheader/ExerciseBoardSubheader"
import ExerciseBoardSidebar from "./ExerciseBoardSidebar/ExerciseBoardSidebar"
import ComponentBoard from "./ComponentBoard/ComponentBoard"
import { Box } from "@mui/material";
import { useState } from 'react'
import { CA_COMPONENTS } from "@/lib/ca-data";
import { DragDropProvider } from "@dnd-kit/react"

export default function ExerciseBoard() {
  /* These state variables indicate where each draggable is and what each droppable is filled with */
  const [isPlaced, setIsPlaced] = useState(Object.fromEntries(CA_COMPONENTS.map((component, _) => [component.id, ""])));
  const [isFilled, setIsFilled] = useState(Object.fromEntries(CA_COMPONENTS.map((component, _) => [component.id, ""])));
  const [score, setScore] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  
  function resetBoard(){
    setIsPlaced(Object.fromEntries(CA_COMPONENTS.map((component, _) => [component.id, ""])));
    setIsFilled(Object.fromEntries(CA_COMPONENTS.map((component, _) => [component.id, ""])));
  }

  function retryBoard(){
    setIsVerified(false);
    setIsPlaced(Object.fromEntries(CA_COMPONENTS.map((component, _) => [component.id, ""])));
    setIsFilled(Object.fromEntries(CA_COMPONENTS.map((component, _) => [component.id, ""])));
    setScore(0);
  }

  function checkWork(){
    setScore(Object.entries(isFilled).filter((componentDroppable) => (componentDroppable[0] == componentDroppable[1])).length);
    setIsVerified(true)
  }

  return (
  <DragDropProvider
    onDragEnd={(event) => {
      if(event.canceled || event.operation.target?.id == null){
        return
      }
      
      if(event.operation.target?.id == "sidebar-droppable"){
        if(isPlaced[event.operation.source?.id as string] == ""){
          // console.log("Placed it in sidebar, but it was already in sidebar.")
          return
        } else {
          // console.log("Placed it in sidebar, from a droppable.")
          setIsFilled({...(isFilled), [isPlaced[event.operation.source?.id as string] as string] : ""})
          setIsPlaced({...(isPlaced), [event.operation.source?.id as string] : ""})
        }
      } else {
        if(isPlaced[event.operation.source?.id as string] != "" && isPlaced[event.operation.source?.id as string] == event.operation.target?.id){
          // console.log("The button was in component, and dropped into same component.")
          return
        }

        if(isPlaced[event.operation.source?.id as string] == ""){
          if(isFilled[event.operation.target?.id as string] == ""){
            // console.log("The button was in sidebar and dropped into empty component.")
            setIsPlaced({...(isPlaced), [event.operation.source?.id as string] : event.operation.target?.id as string})
          } else {
            // console.log("The button was placed from sidebar into component that already had a button.")
            const oldDraggable = isFilled[event.operation.target?.id as string]
            setIsPlaced({...(isPlaced), [oldDraggable] : "", [event.operation.source?.id as string] : event.operation.target?.id as string})
          }
          setIsFilled({...(isFilled), [event.operation.target?.id as string] : event.operation.source?.id as string})
        } else {
          const oldDroppable = isPlaced[event.operation.source?.id as string]
          if(isFilled[event.operation.target?.id as string] == ""){
            // console.log("The button was in component and placed into empty component.")
            setIsFilled({...(isFilled), [oldDroppable] : "", [event.operation.target?.id as string] : event.operation.source?.id as string})
            setIsPlaced({...(isPlaced), [event.operation.source?.id as string] : event.operation.target?.id as string})
          } else {
            // console.log("The button was placed in component that already had a button, had to swap.")
            const oldDraggable = isFilled[event.operation.target?.id as string]
            setIsFilled({...(isFilled), [oldDroppable] : oldDraggable, [event.operation.target?.id as string]: event.operation.source?.id as string})
            setIsPlaced({...(isPlaced), [oldDraggable] : oldDroppable, [event.operation.source?.id as string]: event.operation.target?.id as string})
          }
        }
      }
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', flexGrow: 1}}>
      <ExerciseBoardSubheader />
      <ComponentBoard isFilled={isFilled} isVerified={isVerified}/>
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
      <ExerciseBoardSidebar isPlaced={isPlaced} isVerified={isVerified} score={score} handleReset={resetBoard} handleRetry={retryBoard} handleCheckWork={checkWork}/>
    </Box>
  </DragDropProvider>
)}
