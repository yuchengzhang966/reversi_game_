import React from 'react'
import { Box, Typography } from "@material-ui/core";

export default function MessageList() {
    return (
        <Box width="280px" height="335px">
            <Box textAlign="center" mt="10px">
                <Typography variant="caption">Connected to Chat Server</Typography>
            </Box>
        </Box>
    )
}
