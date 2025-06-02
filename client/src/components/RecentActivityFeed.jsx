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
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function RecentActivityFeed({ activities = [] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = expanded ? activities.length : 5;

  const getActionLabel = (survey) => {
    if (survey.deleted) return "deleted"; // Optional, only if you track deleted actions
    return survey.createdAt === survey.updatedAt ? "created" : "updated";
  };

  const getColor = (action) => {
    switch (action) {
      case "created":
        return "success";
      case "updated":
        return "info";
      case "deleted":
        return "error";
      default:
        return "default";
    }
  };

  const displayedActivities = activities.slice(0, visibleCount);

  return (
    <Paper sx={{ mt: 5, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        <AccessTimeIcon sx={{ verticalAlign: "middle", mr: 1 }} />
        Recent Activity
      </Typography>

      {displayedActivities.length > 0 ? (
        <List>
          {displayedActivities.map((survey) => {
            const action = getActionLabel(survey);
            return (
              <ListItem key={survey._id} divider>
                <ListItemText
                  primary={
                    <>
                      <Typography variant="body1" component="span">
                        "{survey.title}" was{" "}
                      </Typography>
                      <Chip
                        label={action}
                        color={getColor(action)}
                        size="small"
                        sx={{ mx: 1, textTransform: "capitalize" }}
                      />
                      <Typography variant="body1" component="span">
                        by {survey.author}
                      </Typography>
                    </>
                  }
                  secondary={new Date(survey.updatedAt).toLocaleString()}
                />
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography variant="body2" sx={{ pl: 2, pt: 1 }}>
          No recent activity found.
        </Typography>
      )}

      {activities.length > 5 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </Box>
      )}
    </Paper>
  );
}
