import api from "./api";

const MOCK_ROUTES = [
    {
        id: "rt-001",
        trainNumber: "12301",
        trainName: "Howrah Rajdhani Express",
        fromCode: "HWH",
        fromStation: "Howrah Jn",
        toCode: "NDLS",
        toStation: "New Delhi",
        departure: "16:50",
        arrival: "10:05 (+1)",
        duration: "17h 15m",
        availableClasses: [
            { classCode: "1A", name: "AC 1st Class", fare: "₹4,850", seats: 12 },
            { classCode: "2A", name: "AC 2 Tier", fare: "₹2,890", seats: 34 },
            { classCode: "3A", name: "AC 3 Tier", fare: "₹2,050", seats: 88 }
        ],
        frequency: "Daily"
    },
    {
        id: "rt-002",
        trainNumber: "20901",
        trainName: "Vande Bharat Express",
        fromCode: "MMCT",
        fromStation: "Mumbai Central",
        toCode: "ADI",
        toStation: "Ahmedabad Jn",
        departure: "06:00",
        arrival: "11:25",
        duration: "5h 25m",
        availableClasses: [
            { classCode: "EC", name: "Executive Chair", fare: "₹2,505", seats: 8 },
            { classCode: "CC", name: "AC Chair Car", fare: "₹1,385", seats: 45 }
        ],
        frequency: "Except Wed"
    },
    {
        id: "rt-003",
        trainNumber: "12002",
        trainName: "Bhopal Shatabdi Express",
        fromCode: "NDLS",
        fromStation: "New Delhi",
        toCode: "AGC",
        toStation: "Agra Cantt",
        departure: "06:00",
        arrival: "07:50",
        duration: "1h 50m",
        availableClasses: [
            { classCode: "EC", name: "Executive Chair", fare: "₹1,145", seats: 14 },
            { classCode: "CC", name: "AC Chair Car", fare: "₹555", seats: 62 }
        ],
        frequency: "Daily"
    },
    {
        id: "rt-004",
        trainNumber: "12626",
        trainName: "Kerala Express",
        fromCode: "NDLS",
        fromStation: "New Delhi",
        toCode: "NGP",
        toStation: "Nagpur Jn",
        departure: "20:10",
        arrival: "11:45 (+1)",
        duration: "15h 35m",
        availableClasses: [
            { classCode: "2A", name: "AC 2 Tier", fare: "₹2,340", seats: 19 },
            { classCode: "3A", name: "AC 3 Tier", fare: "₹1,620", seats: 52 },
            { classCode: "SL", name: "Sleeper Class", fare: "₹610", seats: 120 }
        ],
        frequency: "Daily"
    }
];

export const searchRoutes = async (from, to, date) => {
    try {
        const response = await api.get(`/routes/search`, { params: { from, to, date } });
        return { data: response.data };
    } catch (error) {
        console.warn("Using mock route search fallback.");
        if (!from && !to) return { data: MOCK_ROUTES };
        
        const filtered = MOCK_ROUTES.filter(r => {
            const matchesFrom = !from || r.fromCode.toLowerCase().includes(from.toLowerCase()) || r.fromStation.toLowerCase().includes(from.toLowerCase());
            const matchesTo = !to || r.toCode.toLowerCase().includes(to.toLowerCase()) || r.toStation.toLowerCase().includes(to.toLowerCase());
            return matchesFrom && matchesTo;
        });

        return { data: filtered.length > 0 ? filtered : MOCK_ROUTES };
    }
};
