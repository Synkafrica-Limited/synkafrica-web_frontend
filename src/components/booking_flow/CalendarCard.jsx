import React, { useState } from "react";
import Buttons from '@/components/ui/Buttons';

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
    return new Date(year, month, 1).getDay();
}

function isSameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(day, start, end) {
    if (!start || !end) return false;
    const d = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    return d > start && d < end;
}

function formatDate(date) {
    return date ? `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}` : "--";
}

/**
 * CalendarCard
 * @param {object} props
 * @param {'single'|'range'} [props.mode='range'] - Selection mode: 'single' for one date, 'range' for timeline
 * @param {Date|string|null} [props.start] - Initial start date
 * @param {Date|string|null} [props.end] - Initial end date (for range mode)
 * @param {function} props.onChange - Callback with selected date(s)
 * @param {function} props.onClose - Callback for closing the calendar
 * @param {string} [props.labelStart='Start date'] - Label for start date
 * @param {string} [props.labelEnd='End date'] - Label for end date (range mode)
 * @param {string} [props.labelSingle='Date'] - Label for single date (single mode)
 */
export default function CalendarCard({
    mode = "range",
    start,
    end,
    onChange,
    onClose,
    labelStart = "Start date",
    labelEnd = "End date",
    labelSingle = "Date"
}) {
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(start ? new Date(start).getMonth() : today.getMonth());
    const [viewYear, setViewYear] = useState(start ? new Date(start).getFullYear() : today.getFullYear());
    const [range, setRange] = useState({
        start: start ? new Date(start) : null,
        end: end ? new Date(end) : null,
    });

    // For two months view
    const nextMonth = (viewMonth + 1) % 12;
    const nextMonthYear = viewMonth === 11 ? viewYear + 1 : viewYear;

    function handleDayClick(day) {
        if (mode === "single") {
            setRange({ start: day, end: null });
            onChange && onChange({ date: day });
            onClose && onClose();
        } else {
            // range mode
            if (!range.start || (range.start && range.end)) {
                setRange({ start: day, end: null });
            } else if (range.start && !range.end) {
                if (day > range.start) {
                    setRange({ start: range.start, end: day });
                    onChange && onChange({ start: range.start, end: day });
                    onClose && onClose();
                } else {
                    setRange({ start: day, end: null });
                }
            }
        }
    }

    function handleMonthChange(e) {
        setViewMonth(Number(e.target.value));
    }

    function handleYearChange(e) {
        let val = Number(e.target.value);
        if (!isNaN(val)) setViewYear(val);
    }

    function renderMonth(year, month, label) {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfWeek(year, month);
        const weeks = [];
        let day = 1 - firstDay;

        for (let w = 0; w < 6; w++) {
            const week = [];
            for (let d = 0; d < 7; d++, day++) {
                if (day < 1 || day > daysInMonth) {
                    week.push(<td key={d}></td>);
                } else {
                    const dateObj = new Date(year, month, day);
                    const isSelectedStart = isSameDay(dateObj, range.start);
                    const isSelectedEnd = isSameDay(dateObj, range.end);
                    const inRange = range.start && range.end && isInRange(dateObj, range.start, range.end);

                    week.push(
                        <td key={d} className="py-0.5">
                            <button
                                className={[
                                    "w-7 h-7 rounded-full flex items-center justify-center transition text-xs",
                                    (mode === "single" && isSelectedStart) ||
                                    (mode === "range" && (isSelectedStart || isSelectedEnd))
                                        ? "bg-primary-500 text-white font-bold"
                                        : inRange
                                            ? "bg-gray-200 text-primary-500"
                                            : "hover:bg-primary-50 text-gray-700",
                                    (d === 0 || d === 6) && "font-medium",
                                ].join(" ")}
                                onClick={() => handleDayClick(dateObj)}
                                type="button"
                            >
                                {day}
                            </button>
                        </td>
                    );
                }
            }
            weeks.push(<tr key={w}>{week}</tr>);
        }

        return (
            <div className="flex flex-col items-center flex-1 min-w-[180px]">
                {/* Month and Year Selectors */}
                <div className="flex items-center gap-2 mb-2">
                    <select
                        value={month}
                        onChange={handleMonthChange}
                        className="border rounded px-1 py-0.5 text-xs bg-white"
                        aria-label="Month"
                    >
                        {MONTHS.map((m, idx) => (
                            <option value={idx} key={m}>{m}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={year}
                        onChange={handleYearChange}
                        className="border rounded px-1 py-0.5 w-16 text-xs bg-white"
                        min={1900}
                        max={2100}
                        aria-label="Year"
                    />
                </div>
                <table className="w-full text-center select-none">
                    <thead>
                        <tr className="text-primary-400">
                            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                <th key={d + i} className="font-normal pb-1 text-xs">{d}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-xs">{weeks}</tbody>
                </table>
            </div>
        );
    }

    // Display labels and values based on mode
    const dateDisplay = (
        <div className="flex flex-col sm:flex-row justify-center mb-3 space-y-2 sm:space-y-0 sm:space-x-4">
            {mode === "single" ? (
                <div className="bg-gray-100 rounded-md px-3 py-1 text-center min-w-[100px]">
                    <div className="text-xs text-gray-500">{labelSingle}</div>
                    <div className="text-xs font-medium text-gray-800">{formatDate(range.start)}</div>
                </div>
            ) : (
                <>
                    <div className="bg-gray-100 rounded-md px-3 py-1 text-center min-w-[100px]">
                        <div className="text-xs text-gray-500">{labelStart}</div>
                        <div className="text-xs font-medium text-gray-800">{formatDate(range.start)}</div>
                    </div>
                    <div className="bg-gray-100 rounded-md px-3 py-1 text-center min-w-[100px]">
                        <div className="text-xs text-gray-500">{labelEnd}</div>
                        <div className="text-xs font-medium text-gray-800">{formatDate(range.end)}</div>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="absolute z-30 left-0 mt-2 bg-white rounded-xl shadow-2xl p-2 sm:p-4 w-full max-w-full min-w-[90vw] sm:min-w-[540px] sm:max-w-md">
            {/* Date Range/Single Date Display */}
            {dateDisplay}
            {/* Calendar */}
            <div className="flex flex-col gap-2 items-center sm:flex-row sm:gap-4">
                {/* Prev Month */}
                <Buttons
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 border border-primary-200 rounded-lg flex items-center justify-center text-primary-500 text-lg mr-0 sm:mr-2"
                    onClick={() => {
                        if (viewMonth === 0) {
                            setViewMonth(11);
                            setViewYear(viewYear - 1);
                        } else {
                            setViewMonth(viewMonth - 1);
                        }
                    }}
                    type="button"
                >
                    &#8592;
                </Buttons>
                {/* Month 1 */}
                {renderMonth(viewYear, viewMonth)}
                {/* Month 2 (only for range mode) */}
                {mode === "range" && (
                    <div className="hidden sm:block">{renderMonth(nextMonthYear, nextMonth)}</div>
                )}
                {/* Next Month */}
                <Buttons
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 border border-primary-200 rounded-lg flex items-center justify-center text-primary-500 text-lg ml-0 sm:ml-2"
                    onClick={() => {
                        if (viewMonth === 11) {
                            setViewMonth(0);
                            setViewYear(viewYear + 1);
                        } else {
                            setViewMonth(viewMonth + 1);
                        }
                    }}
                    type="button"
                >
                    &#8594;
                </Buttons>
            </div>
            {/* Done Button */}
            <div className="flex justify-end mt-4">
                <button
                    className="bg-primary-500 text-white px-5 py-1.5 rounded-md font-medium text-sm"
                    onClick={() => {
                        if (mode === "single") {
                            onChange && onChange({ date: range.start });
                        } else {
                            onChange && onChange({ start: range.start, end: range.end });
                        }
                        onClose && onClose();
                    }}
                >
                    Done
                </button>
            </div>
        </div>
    );
}