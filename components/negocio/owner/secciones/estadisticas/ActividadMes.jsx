const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date(dateStr);
  const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  if (isoDateOnly) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(dateStr);
};

export default function ActividadMes({ turnos = [] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const counts = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const c = turnos.filter(
      (t) => parseLocalDate(t.fecha).getDate() === day,
    ).length;
    return c;
  });

  const maxCount = Math.max(1, ...counts);

  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7;

  const weeks = [];
  let week = new Array(startWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push({ day: d, count: counts[d - 1] });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];

  const getBg = (count) => {
    if (!count) return "#f3f4f6";
    const alpha = 0.25 + 0.65 * (count / maxCount);
    return `rgba(29, 158, 117, ${alpha.toFixed(2)})`;
  };

  return (
    <div>
      <div className="grid grid-cols-7  text-xs text-gray-400 mb-2">
        {dayLabels.map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-rows-[repeat(6,auto)] gap-2">
        {weeks.map((w, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-2">
            {w.map((cell, ci) => (
              <div
                key={ci}
                className={`h-10 w-10 rounded-md flex items-center justify-center text-sm font-medium`}
                style={{
                  backgroundColor: cell ? getBg(cell.count) : "transparent",
                }}
              >
                {cell ? (
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-700">{cell.day}</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
