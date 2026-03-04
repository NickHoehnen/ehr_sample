"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// TypeScript interfaces (remove if using standard JSX)
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
}

export default function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Sample initial events
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Meeting",
      date: new Date(),
      description: "Discuss project milestones.",
    },
    {
      id: "3",
      title: "Team Meeting2",
      date: new Date(),
      description: "Discuss project milestones.",
    },
    {
      id: "2",
      title: "Doctor Appointment",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      description: "Routine checkup.",
    },
  ]);

  // Dialog State
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Navigation
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Event Handlers
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleSave = () => {
    if (selectedEvent) {
      setEvents((prev) =>
        prev.map((e) => (e.id === selectedEvent.id ? selectedEvent : e))
      );
    }
    handleCloseDialog();
  };

  const renderCells = () => {
    const cells = [];
    
    // Empty slots before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<Box key={`empty-${i}`} sx={{ p: 1, minHeight: 100 }} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const dayEvents = events.filter(
        (e) => e.date.toDateString() === cellDate.toDateString()
      );

      cells.push(
        <Paper
          key={`day-${day}`}
          variant="outlined"
          sx={{
            p: 1,
            minHeight: 100,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            bgcolor:
              new Date().toDateString() === cellDate.toDateString()
                ? "action.hover"
                : "background.paper",
          }}
        >
          <Typography variant="body2" color="text.secondary" align="right">
            {day}
          </Typography>
          
          {dayEvents.map((event) => (
            <Paper
              key={event.id}
              onClick={() => handleEventClick(event)}
              sx={{
                p: 0.5,
                bgcolor: "primary.light",
                color: "primary.contrastText",
                cursor: "pointer",
                "&:hover": { bgcolor: "primary.main" },
              }}
            >
              <Typography variant="caption" noWrap display="block">
                {event.title}
              </Typography>
            </Paper>
          ))}
        </Paper>
      );
    }
    return cells;
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", p: 2 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Days of Week */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, mb: 1 }}>
        {daysOfWeek.map((day) => (
          <Typography key={day} align="center" fontWeight="bold" color="text.secondary">
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
        {renderCells()}
      </Box>

      {/* Edit Event Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Title"
            fullWidth
            value={selectedEvent?.title || ""}
            onChange={(e) =>
              setSelectedEvent((prev) => prev ? { ...prev, title: e.target.value } : null)
            }
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={selectedEvent?.description || ""}
            onChange={(e) =>
              setSelectedEvent((prev) => prev ? { ...prev, description: e.target.value } : null)
            }
          />
          <Typography variant="caption" color="text.secondary">
            Date: {selectedEvent?.date.toLocaleDateString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}