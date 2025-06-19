import React, { useState } from "react";
import Button from "../ui/Buttons";

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
    return date ? `${MONTHS[date.getMonth()]} ${date.getDate()}` : "--";
}

export default function CalendarCard({ start, end, onChange, onClose }) {
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [range, setRange] = useState({
        start: start ? new Date(start) : null,
        end: end ? new Date(end) : null,
    });
    const [selecting, setSelecting] = useState(false);

    // For two months view
    const nextMonth = (viewMonth + 1) % 12;
    const nextMonthYear = viewMonth === 11 ? viewYear + 1 : viewYear;

    function handleDayClick(day) {
        if (!range.start || (range.start && range.end)) {
            setRange({ start: day, end: null });
            setSelecting(true);
        } else if (range.start && !range.end) {
            if (day > range.start) {
                setRange({ start: range.start, end: day });
                setSelecting(false);
                onChange && onChange({ start: range.start, end: day });
            } else {
                setRange({ start: day, end: null });
            }
        }
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
                        <td key={d} className="py-1">
                            <button
                                className={[
                                    "w-8 h-8 rounded-full flex items-center justify-center transition",
                                    isSelectedStart || isSelectedEnd
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
            <div className="flex flex-col items-center flex-1 min-w-[220px]">
                <div className="font-bold text-lg mb-2">{MONTHS[month]} {year}</div>
                <table className="w-full text-center select-none">
                    <thead>
                        <tr className="text-primary-400">
                            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                <th key={d + i} className="font-normal pb-1">{d}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="text-base">{weeks}</tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="absolute z-30 left-0 mt-2 bg-white rounded-xl shadow-2xl p-4 sm:p-8 w-full max-w-full min-w-[90vw] sm:min-w-[700px] sm:max-w-2xl">
            {/* Date Range Display */}
            <div className="flex flex-col sm:flex-row justify-center mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="bg-gray-100 rounded-md px-4 py-2 text-center min-w-[120px]">
                    <div className="text-xs text-gray-500">Start date</div>
                    <div className="text-base font-medium text-gray-800">{formatDate(range.start)}</div>
                </div>
                <div className="bg-gray-100 rounded-md px-4 py-2 text-center min-w-[120px]">
                    <div className="text-xs text-gray-500">End date</div>
                    <div className="text-base font-medium text-gray-800">{formatDate(range.end)}</div>
                </div>
            </div>
            {/* Calendar */}
            <div className="flex flex-col gap-4 items-center sm:flex-row sm:gap-8">
                {/* Prev Month */}
                <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 border border-primary-200 rounded-lg flex items-center justify-center text-primary-500 text-2xl mr-0 sm:mr-2"
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
                </Button>
                {/* Month 1 */}
                {renderMonth(viewYear, viewMonth)}
                {/* Month 2 */}
                <div className="hidden sm:block">{renderMonth(nextMonthYear, nextMonth)}</div>
                {/* Next Month */}
                <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 border border-primary-200 rounded-lg flex items-center justify-center text-primary-500 text-2xl ml-0 sm:ml-2"
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
                </Button>
            </div>
            {/* Done Button */}
            <div className="flex justify-end mt-8">
                <button
                    className="bg-primary-500 text-white px-8 py-2 rounded-md font-medium text-lg"
                    onClick={onClose}
                >
                    Done
                </button>
            </div>
        </div>
    );
}