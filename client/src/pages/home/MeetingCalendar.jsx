import React, { useState, useEffect } from 'react';
import axiosInstance from '../../apis/axiosInstance';
import useAuthStore from '../../store/useAuthStore';
import { FcAlarmClock } from "react-icons/fc";
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

function MeetingCalendar() {
    const { token, isAuthenticated } = useAuthStore();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLinkCopied, setIsLinkCopied] = useState(false);

    const localizer = momentLocalizer(moment)

    const handleCopyLink = () => {
        const link = selectedEvent.extendedProps.meetingLink;
        if (link) {
            navigator.clipboard.writeText(link)
                .then(() => {
                    setIsLinkCopied(true);
                    setTimeout(() => setIsLinkCopied(false), 2000); // Reset after 4 seconds
                })
                .catch((err) => {
                    console.error('Failed to copy link:', err);
                });
        }
    };

    const handleJoinMeeting = () => {
        const meetingURL = selectedEvent.extendedProps.meetingLink;
        if (meetingURL) {
            window.location.href = meetingURL;
        }
        handleCloseModal(); // Close the modal after navigating
    };


    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setSelectedEvent(null);
    };

    useEffect(() => {
        if (!isAuthenticated || !token) {
            setLoading(false);
            return;
        }

        const fetchMeetings = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/api/meetings/getScheduleMeetings');

                const formattedEvents = response.data.map(meeting => {
                    const startDate = new Date(meeting.date);
                    return {
                        id: meeting._id,
                        title: meeting.title,
                        start: new Date(meeting.date),
                        meetingLink: meeting.meetingLink,
                        end: new Date(startDate.getTime() + 60 * 60 * 1000),
                    }
                });

                setEvents(formattedEvents);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching meetings:", err);
                setError("Failed to load meetings.");
                setLoading(false);
            }
        };

        fetchMeetings();
    }, [isAuthenticated, token]); // Refetch when auth state changes

    if (loading) {
        return <div>Loading calendar...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }


    return (
        <div className="meeting-calendar-container bg-gray-100 p-4 rounded-2xl border-amber-500 border-2">
            <div>
                <Calendar
                    localizer={localizer}
                    events={events}
                    selectable={true}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="month"
                    views={['month', 'week', 'day']}
                    style={{ height: 500, }}
                    onSelectEvent={(event) => {
                        handleEventClick(event);
                    }}
                    components={{
                        event: ({ event }) => (
                            <span className="flex items-center gap-2">
                                <FcAlarmClock className="shrink-0 w-5 h-5" />
                                <p className="truncate text-sm">{event.title}</p>
                            </span>

                        ),
                    }}
                />
            </div>

            {/* ==================== modal to show meeting info =========================== */}
            {modalIsOpen && selectedEvent && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm"
                    onClick={handleCloseModal}
                >
                    {/* Modal */}
                    <div
                        className="w-full divide-y divide-gray-50 max-w-md bg-gray-700 rounded-2xl shadow-2xl text-white overflow-hidden transform transition-all duration-300 scale-95 opacity-0 animate-fadeInUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4">
                            <h2 className="text-xl font-semibold truncate">Meeting Info</h2>
                            <button
                                className="text-gray-400 hover:text-white transition text-2xl"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4 space-y-3">
                            <p>
                                <span className="font-medium text-gray-300">Meeting Title:</span>{" "}
                                {selectedEvent.title}
                            </p>
                            <p>
                                <span className="font-medium text-gray-300">Start:</span>{" "}
                                {selectedEvent.start.toLocaleString("en-GB")}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="font-medium text-gray-300">Meeting Link:</span>{" "}
                                <button
                                    onClick={handleCopyLink}
                                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
                                >
                                    <span>{isLinkCopied ? 'Link Copied!' : 'Copy Link'}</span>
                                </button>
                            </p>

                            {/* Add more details here */}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 transition"
                            >
                                Close
                            </button>
                            <button onClick={handleJoinMeeting} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition">
                                Join Meeting
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default MeetingCalendar;
