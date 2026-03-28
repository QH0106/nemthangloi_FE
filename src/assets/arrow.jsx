import { Box } from "@mui/material";
import React from "react";

const Arrow = ({open, color = "#DE3E96"}) => {
  return (
    <Box fontSize={12} width={"1em"} height={"1em"} ml={1} sx={{color, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease-in-out"}}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
        <path d="M224 353.9l17-17L401 177l17-17L384 126.1l-17 17-143 143L81 143l-17-17L30.1 160l17 17L207 337l17 17z"></path>
      </svg>
    </Box>
  );
};

export default Arrow;
