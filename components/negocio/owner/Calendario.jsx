"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendario({ turnos }) {
  const events = turnos.map((t) => ({
    id: t.id,
    title: t.Clientes?.nombre || "Turno",
    start: t.fechaInicio,
    end: t.fechaFin,
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        selectable={true}
        editable={true}
        height={500}   
        headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "timeGridWeek,timeGridDay,dayGridMonth",
        }}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        nowIndicator={true}
        slotDuration="00:30:00"
      />
    </div>
  );
}