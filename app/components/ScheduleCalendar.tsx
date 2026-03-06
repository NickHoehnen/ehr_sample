"use client";

import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
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

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
  color?: string; // Added for variety
}

export default function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Meeting",
      date: new Date(),
      description: "Discuss project milestones.",
      color: "#00f2fe",
    },
    {
      id: "3",
      title: "Design Review",
      date: new Date(),
      description: "Approve new mockups.",
      color: "#89f7fe",
    },
    {
      id: "2",
      title: "Doctor Appointment",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      description: "Routine checkup.",
      color: "#f093fb",
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const renderCells = () => {
    const cells = [];
    // Empty slots before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(
        <Box 
          key={`empty-${i}`} 
          sx={{ p: 1, minHeight: { xs: 80, sm: 120 }, border: "1px solid transparent" }} 
        />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const isToday = new Date().toDateString() === cellDate.toDateString();
      const dayEvents = events.filter(
        (e) => e.date.toDateString() === cellDate.toDateString(),
      );

      cells.push(
        <Box
          key={`day-${day}`}
          sx={{
            p: { xs: 0.5, sm: 1.5 },
            minHeight: { xs: 80, sm: 120 },
            display: "flex",
            flexDirection: "column",
            gap: 1,
            borderRadius: { xs: "8px", sm: "12px" },
            border: "1px solid",
            borderColor: isToday ? "primary.main" : "rgba(255, 255, 255, 0.1)",
            background: isToday
              ? "linear-gradient(145deg, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.15))"
              : "transparent",
            boxShadow: isToday ? "0 0 5px rgba(25, 118, 210, 0.3)" : "none",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "primary.light",
              boxShadow: "0 0 8px rgba(25, 118, 210, 0.2)",
              transform: "translateY(-2px)",
              bgcolor: "rgba(255, 255, 255, 0.02)",
            },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: isToday ? 800 : 400,
              color: isToday ? "primary.main" : "grey.300",
              textAlign: "right",
              fontSize: { xs: "0.65rem", sm: "0.75rem" }
            }}
          >
            {day}
          </Typography>

          {/* Event Container: Row on mobile, Column on desktop */}
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "row", sm: "column" }, 
              flexWrap: "wrap",
              gap: 0.5,
              mt: "auto" // Pushes the dots to the bottom on mobile
            }}
          >
            {/* Day events */}
            {dayEvents.map((event) => (
              <Box
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation(); // Prevents clicking the cell if you add cell-click logic later
                  handleEventClick(event);
                }}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  
                  // MOBILE STYLES: 24x24 Circular Dot
                  width: { xs: 20, sm: "auto" },
                  height: { xs: 20, sm: "auto" },
                  borderRadius: { xs: "50%", sm: "0px" },
                  bgcolor: { xs: event.color || "primary.main", sm: "transparent" },
                  
                  // DESKTOP STYLES: Border Accent
                  borderLeft: { xs: "none", sm: `3px solid ${event.color || "#1976d2"}` },
                  px: { xs: 0, sm: 0.5 },
                  
                  "&:hover": {
                    transform: { xs: "scale(1.2)", sm: "translateX(4px)" },
                  },
                }}
              >
                {/* Text is hidden on mobile, visible on desktop */}
                <Typography
                  variant="caption"
                  
                  sx={{
                    display: { xs: "none", sm: "block" },
                    fontWeight: "bold",
                    color: event.color || "primary.main",
                    lineHeight: 1.2,
                    fontSize: "0.75rem",
                  }}
                >
                  {event.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>,
      );
    }
    return cells;
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", p: 1, bgcolor: "#0f172a", borderRadius: 4, minHeight: "80vh" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ color: "white", fontWeight: 800, letterSpacing: "-1px" }}>
          {currentDate.toLocaleString("default", { month: "long" })} <span style={{ color: "#64748b" }}>{year}</span>
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '12px', p: 0.5 }}>
            <IconButton onClick={handlePrevMonth} sx={{ color: "white" }}>
            <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={handleNextMonth} sx={{ color: "white" }}>
            <ChevronRightIcon />
            </IconButton>
        </Box>
      </Box>

      {/* Days of Week */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 2 }}>
        {daysOfWeek.map((day) => (
          <Typography key={day} align="center" sx={{ color: "grey.600", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1.5 }}>
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box 
        sx={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(7, 1fr)", 
          gap: { xs: 0.5, sm: 1.5 } 
        }}
      >
        {renderCells()}
      </Box>

      {/* Modernized Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        PaperProps={{
            sx: { borderRadius: '20px', padding: 1, bgcolor: '#1e293b', color: 'white' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>{selectedEvent?.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#94a3b8', mb: 2 }}>{selectedEvent?.description}</Typography>
          <TextField
            fullWidth
            variant="filled"
            label="Title"
            value={selectedEvent?.title || ""}
            sx={{ input: { color: 'white' }, mb: 2 }}
            onChange={(e) => setSelectedEvent(p => p ? {...p, title: e.target.value} : null)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsDialogOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" sx={{ borderRadius: '10px', px: 4 }} onClick={() => setIsDialogOpen(false)}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}