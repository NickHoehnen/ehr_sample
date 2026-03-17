"use client";

import React, { useState, useMemo } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useTheme,
  alpha,
} from "@mui/material";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
  color?: string;
}

export default function ScheduleCalendar() {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "1", title: "Team Meeting", date: new Date(), description: "Discuss project milestones.", color: "#00f2fe" },
    { id: "3", title: "Design Review", date: new Date(), description: "Approve new mockups.", color: "#89f7fe" },
    { id: "2", title: "Doctor Appointment", date: new Date(new Date().setDate(new Date().getDate() + 2)), description: "Routine checkup.", color: "#f093fb" },
  ]);

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- Date Math ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  // --- Logic Separation: Generate Calendar Data Array ---
  const calendarCells = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const cells = [];

    // Empty padding days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push({ type: "empty", id: `empty-${i}` });
    }

    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const isToday = new Date().toDateString() === cellDate.toDateString();
      const dayEvents = events.filter((e) => e.date.toDateString() === cellDate.toDateString());
      
      cells.push({ type: "day", id: `day-${day}`, day, isToday, dayEvents });
    }

    return cells;
  }, [year, month, events]);

  return (
    // Outer Box: Fills parent container, drops the hardcoded heights/colors
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, pt: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {currentDate.toLocaleString("default", { month: "long" })}
          <Box component="span" sx={{ color: "text.secondary", ml: 1, fontWeight: 500 }}>
            {year}
          </Box>
        </Typography>

        {/* Action Buttons using theme dividers and alpha */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1, 
            bgcolor: alpha(theme.palette.text.primary, 0.05), 
            borderRadius: 2, 
            p: 0.5,
          }}
        >
          <IconButton onClick={handlePrevMonth} aria-label="Previous Month">
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={handleNextMonth} aria-label="Next Month">
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Days of Week Text */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 1 }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Typography 
            key={day} 
            align="center" 
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box 
        sx={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(7, 1fr)", 
          gap: { xs: 0.5, sm: 1 },
          flexGrow: 1 // Allows the grid to stretch to the bottom of the App Shell
        }}
      >
        {calendarCells.map((cell) => {
          if (cell.type === "empty") {
            return <Box key={cell.id} sx={{ minHeight: { xs: 80, sm: 120 } }} />;
          }

          return (
            <Box
              key={cell.id}
              sx={{
                p: { xs: 0.5, sm: 1 },
                minHeight: { xs: 80, sm: 120 },
                display: "flex",
                flexDirection: "column",
                gap: 1,
                borderRadius: 1,
                border: "1px solid",
                // Dynamic border based on theme divider
                borderColor: cell.isToday ? "primary.main" : "divider",
                // Using MUI alpha for clean, theme-aware translucency
                bgcolor: cell.isToday ? alpha(theme.palette.primary.main, 0.05) : "background.paper",
                boxShadow: cell.isToday ? `0 0 10px ${alpha(theme.palette.primary.main, 0.2)}` : "none",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: cell.isToday ? "primary.main" : "text.secondary",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: cell.isToday ? 800 : 500,
                  color: cell.isToday ? "primary.main" : "text.secondary",
                  textAlign: "right",
                  fontSize: { xs: "0.65rem", sm: "0.75rem" }
                }}
              >
                {cell.day}
              </Typography>

              {/* Event Container */}
              <Box 
                sx={{ 
                  display: "flex", 
                  flexDirection: { xs: "row", sm: "column" }, 
                  flexWrap: "wrap",
                  gap: 0.5,
                  mt: "auto" 
                }}
              >
                {cell.dayEvents?.map((event) => (
                  <Box
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                    sx={{
                      cursor: "pointer",
                      width: { xs: 8, sm: "100%" }, // Slightly smaller dots on mobile for a cleaner look
                      height: { xs: 8, sm: "auto" },
                      borderRadius: { xs: "50%", sm: 1 },
                      bgcolor: { xs: event.color || "primary.main", sm: alpha(event.color || theme.palette.primary.main, 0.1) },
                      borderLeft: { xs: "none", sm: `3px solid ${event.color || theme.palette.primary.main}` },
                      px: { xs: 0, sm: 0.5 },
                      py: { xs: 0, sm: 0.25 },
                      "&:hover": {
                        bgcolor: { sm: alpha(event.color || theme.palette.primary.main, 0.2) }
                      },
                    }}
                  >
                    <Typography
                      // noWrap // Prevents long text from breaking the grid
                      sx={{
                        display: { xs: "none", sm: "block" },
                        fontWeight: 600,
                        color: event.color || "primary.main",
                        fontSize: "0.7rem",
                      }}
                    >
                      {event.title}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        // Let the ThemeRegistry handle the standard border radius for Paper/Dialogs
      >
        <DialogTitle sx={{ fontWeight: 800 }}>{selectedEvent?.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary', mb: 3, mt: 1 }}>
            {selectedEvent?.description}
          </Typography>
          <TextField
            fullWidth
            variant="outlined" // Outlined usually plays nicer with automatic light/dark theming than filled
            label="Event Title"
            value={selectedEvent?.title || ""}
            onChange={(e) => setSelectedEvent(p => p ? {...p, title: e.target.value} : null)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setIsDialogOpen(false)} color="inherit" sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setIsDialogOpen(false)} disableElevation>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}