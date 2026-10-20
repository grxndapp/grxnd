
export const NormalCardStyles: React.CSSProperties = {
   width: "100%", padding: "25px",
   borderRadius: "30px", boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px"
}

export const SubjectIconBubble: React.CSSProperties = {
   width: "50px", aspectRatio: "1", padding: "10px",
   borderRadius: "100%", background: "white", display: "flex",
   alignItems: "center", justifyContent: "center"
}

export const BackpackOpenIconBubble: React.CSSProperties = {
   width: "fit-content", aspectRatio: "1/1", padding: "10px",
   borderRadius: "100%", background: "white", display: "flex",
   alignItems: "center", justifyContent: "center", backgroundColor: "#ffffffbb"
}

export const BackpackCardStyles : React.CSSProperties = {
   padding: "25px", borderRadius: "30px", width: "100%",
   maxWidth: "450px", boxShadow: "0 1px 6px 2px rgba(0,0,0,0.07)",
   display: "flex", alignItems: "center", justifyContent: "center",
   background: "url('./gradient-bg.png')", backgroundRepeat: "no-repeat",
   backgroundSize: "cover", backgroundPosition: "center", cursor: "pointer"
}

export const NotebookCardStyles: React.CSSProperties = {
   backgroundColor: "white", border: "1px solid #f3f3f3",
   padding: "30px", borderRadius: "30px", cursor: "pointer",
   width: "100%", maxWidth: "500px", boxShadow: "0 1px 4px 2px rgba(0, 0, 0, 0.01)"
}

export const AiToolsCardStyles: React.CSSProperties = {
   width: "100%", maxWidth: "500px", padding: "25px", border: "1px solid #f3f3f3",
   borderRadius: "18px", boxShadow: "0 1px 4px 2px rgba(0, 0, 0, 0.01)", cursor: "pointer",
   display: "flex", flexDirection: "column", justifyContent: "start", gap: "10px"
}

export const ToolIconBubbleStyles: React.CSSProperties = {
   width: "45px", aspectRatio: "1", padding: "5px",
   borderRadius: "10px", background: "white", display: "flex",
   alignItems: "center", justifyContent: "center"
}

export const FilterSubjectStyles: React.CSSProperties = {
   width: "fit-content", padding: "10px 20px", border: "1px solid #222", cursor: "pointer",
   borderRadius: "30px", display: "flex", justifyContent: "center", alignItems: "center"
}

export const FilterSubjectSelectedStyles: React.CSSProperties = {
   width: "fit-content", padding: "10px 20px", border: "1px solid #222", cursor: "pointer",
   borderRadius: "30px", display: "flex", justifyContent: "center", alignItems: "center",
   background: "#222", color: "white", gap: "5px"
}

export const UserCardStyles: React.CSSProperties = {
   width: "100%", maxWidth: "350px", padding: "20px", border: "1px solid #dfdfdf", cursor: "pointer",
   borderRadius: "20px", display: "flex", flexDirection: "column",
}

export const QuizQuestionReviewCardStyles: React.CSSProperties = {
   width: "100%", padding: "20px", border: "1px solid #dfdfdf",
   borderRadius: "20px", display: "flex", flexDirection: "column",
}

export const SubjectProgressCardStyles: React.CSSProperties = {
   width: "100%", maxWidth: "370px", borderRadius: "25px",
   padding: "25px", cursor: "pointer", border: "1px solid #c4cdff9a",
}

export const ExamReadyScoreCtaCardStyles: React.CSSProperties = {
   width: "100%", borderRadius: "25px",
   padding: "15px 25px", cursor: "pointer", border: "1px solid #c4cdff9a",
}

export const ExamDateCardStyles: React.CSSProperties = {
   width: "100%", borderRadius: "15px", background: "white",
   padding: "13px 15px", cursor: "pointer", border: "1px solid #c4cdff9a",
}

export const ChooseFolderSaveBtnStyles: React.CSSProperties = {
   width: "100%", borderRadius: "15px", background: "white",
   padding: "15px", cursor: "pointer", border: "1px solid #c4cdff9a",
}

export const ChooseFolderSaveBtnSelectedStyles: React.CSSProperties = {
   width: "100%", borderRadius: "15px", background: "var(--accent-color-30)",
   padding: "15px", cursor: "pointer", border: "1px solid #c4cdff9a", fontWeight: "600"
}