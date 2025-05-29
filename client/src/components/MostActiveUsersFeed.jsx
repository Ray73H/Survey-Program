import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

export default function MostActiveUsersFeed({ surveys = [], users = [], responseStats = {} }) {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = expanded ? 10 : 5;

  const experimenters = users.filter((u) => u.accountType === "experimenter");

  const surveyCounts = {};
  surveys.forEach((s) => {
    const uid = s.userId;
    if (!surveyCounts[uid]) surveyCounts[uid] = 0;
    surveyCounts[uid]++;
  });

  const ranked = experimenters
    .map((u) => ({
      ...u,
      surveysCreated: surveyCounts[u._id] || 0,
      responses: responseStats[u._id] || 0,
    }))
    .sort((a, b) => b.surveysCreated - a.surveysCreated)
    .slice(0, 20);

  const displayed = ranked.slice(0, visibleCount);

  return (
    <Paper sx={{ mt: 5, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        <GroupIcon sx={{ verticalAlign: "middle", mr: 1 }} />
        Most Active Experimenters
      </Typography>

      <List>
        {displayed.map((user) => (
          <ListItem key={user._id} divider>
            <ListItemText
              primary={
                <>
                  <Typography variant="body1" component="span">
                    {user.name} created{" "}
                  </Typography>
                  <Chip label={`${user.surveysCreated} surveys`} color="primary" size="small" sx={{ mx: 1 }} />
                  <Typography variant="body1" component="span">
                    & received{" "}
                  </Typography>
                  <Chip label={`${user.responses} responses`} color="secondary" size="small" sx={{ mx: 1 }} />
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      {ranked.length > 5 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </Box>
      )}
    </Paper>
  );
}

