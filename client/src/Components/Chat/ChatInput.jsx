import React from 'react'
import { TextField, Box } from "@material-ui/core"; 

export default function ChatInput() {
    return (
        <Box display="flex" width="280px">
          <TextField variant="outlined" fullWidth />  
        </Box>
    )
}
