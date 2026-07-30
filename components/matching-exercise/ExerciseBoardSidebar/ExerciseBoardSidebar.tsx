interface ExerciseBoardSidebarProps {
    isVerified: boolean;
    score: number;
    handleReset(): void;
    handleCheckWork(): void;
}
export default function ExerciseBoardSidebar ({ isVerified, score, handleReset, handleCheckWork }: ExerciseBoardSidebarProps) {
    return (isVerified ? <>
        
    </> 
    : "")
}
