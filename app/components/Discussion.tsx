import { FC } from "react";
import { Box, Typography } from "@mui/material";

import type { Contribution } from "@prisma/client";

interface DiscussionProps {
  contribution: Contribution;
}

const Discussion: FC<DiscussionProps> = ({ contribution }) => {
  return (
    <Box>
      <Typography variant="h3" fontFamily="rasa" sx={{ mt: ".5rem" }}>
        {contribution.contributionName}
      </Typography>
    </Box>
  );
};

export default Discussion;
