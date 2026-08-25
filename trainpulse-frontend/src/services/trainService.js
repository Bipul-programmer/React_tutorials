import api from "./api";

// Comprehensive mock train dataset for fallback
const MOCK_TRAINS = [
    {
        id: "tr-101",
        trainNumber: "12301",
        name: "Howrah Rajdhani Express",
        source: "Howrah Jn (HWH)",
        destination: "New Delhi (NDLS)",
        departureTime: "16:50",
        arrivalTime: "10:05 (+1 day)",
        status: "ON-TIME",
        speed: "125 km/h",
        currentStation: "Kanpur Central (CNB)",
        nextStation: "New Delhi (NDLS)",
        delayMinutes: 0,
        type: "Rajdhani / Superfast",
        totalCoaches: 21,
        occupancy: "98%",
        route: [
            { station: "Howrah Jn (HWH)", code: "HWH", arrival: "--", departure: "16:50", day: 1, status: "DEPARTED" },
            { station: "Dhanbad Jn (DHN)", code: "DHN", arrival: "20:00", departure: "20:05", day: 1, status: "DEPARTED" },
            { station: "Pt. DD Upadhyaya (DDU)", code: "DDU", arrival: "00:45", departure: "00:55", day: 2, status: "DEPARTED" },
            { station: "Kanpur Central (CNB)", code: "CNB", arrival: "04:30", departure: "04:35", day: 2, status: "AT STATION" },
            { station: "New Delhi (NDLS)", code: "NDLS", arrival: "10:05", departure: "--", day: 2, status: "SCHEDULED" }
        ]
    },
    {
        id: "tr-102",
        trainNumber: "20901",
        name: "Vande Bharat Express",
        source: "Mumbai Central (MMCT)",
        destination: "Gandhinagar Capital (GNC)",
        departureTime: "06:00",
        arrivalTime: "12:25",
        status: "RUNNING",
        speed: "130 km/h",
        currentStation: "Surat (ST)",
        nextStation: "Vadodara Jn (BRC)",
        delayMinutes: 2,
        type: "Vande Bharat",
        totalCoaches: 16,
        occupancy: "100%",
        route: [
            { station: "Mumbai Central (MMCT)", code: "MMCT", arrival: "--", departure: "06:00", day: 1, status: "DEPARTED" },
            { station: "Vapi (VAPI)", code: "VAPI", arrival: "07:56", departure: "07:58", day: 1, status: "DEPARTED" },
            { station: "Surat (ST)", code: "ST", arrival: "08:55", departure: "09:00", day: 1, status: "DEPARTED" },
            { station: "Vadodara Jn (BRC)", code: "BRC", arrival: "10:13", departure: "10:18", day: 1, status: "EN ROUTE" },
            { station: "Ahmedabad Jn (ADI)", code: "ADI", arrival: "11:25", departure: "11:30", day: 1, status: "SCHEDULED" },
            { station: "Gandhinagar Capital (GNC)", code: "GNC", arrival: "12:25", departure: "--", day: 1, status: "SCHEDULED" }
        ]
    },
    {
        id: "tr-103",
        trainNumber: "12002",
        name: "Bhopal Shatabdi Express",
        source: "New Delhi (NDLS)",
        destination: "Rani Kamalapati (RKMP)",
        departureTime: "06:00",
        arrivalTime: "14:40",
        status: "DELAYED",
        speed: "85 km/h",
        currentStation: "Agra Cantt (AGC)",
        nextStation: "Gwalior (GWL)",
        delayMinutes: 25,
        type: "Shatabdi",
        totalCoaches: 18,
        occupancy: "92%",
        route: [
            { station: "New Delhi (NDLS)", code: "NDLS", arrival: "--", departure: "06:00", day: 1, status: "DEPARTED" },
            { station: "Mathura Jn (MTJ)", code: "MTJ", arrival: "07:19", departure: "07:20", day: 1, status: "DEPARTED" },
            { station: "Agra Cantt (AGC)", code: "AGC", arrival: "07:50", departure: "07:55", day: 1, status: "DEPARTED" },
            { station: "Gwalior (GWL)", code: "GWL", arrival: "09:23", departure: "09:25", day: 1, status: "EN ROUTE" },
            { station: "Jhansi Jn (VGLJ)", code: "VGLJ", arrival: "10:45", departure: "10:50", day: 1, status: "SCHEDULED" },
            { station: "Rani Kamalapati (RKMP)", code: "RKMP", arrival: "14:40", departure: "--", day: 1, status: "SCHEDULED" }
        ]
    },
    {
        id: "tr-104",
        trainNumber: "12626",
        name: "Kerala Express",
        source: "New Delhi (NDLS)",
        destination: "Trivandrum Central (TVC)",
        departureTime: "20:10",
        arrivalTime: "18:00 (+2 days)",
        status: "RUNNING",
        speed: "105 km/h",
        currentStation: "Nagpur Jn (NGP)",
        nextStation: "Balharshah (BPQ)",
        delayMinutes: 10,
        type: "Superfast Express",
        totalCoaches: 24,
        occupancy: "95%",
        route: [
            { station: "New Delhi (NDLS)", code: "NDLS", arrival: "--", departure: "20:10", day: 1, status: "DEPARTED" },
            { station: "Bhopal Jn (BPL)", code: "BPL", arrival: "05:30", departure: "05:40", day: 2, status: "DEPARTED" },
            { station: "Nagpur Jn (NGP)", code: "NGP", arrival: "11:45", departure: "11:50", day: 2, status: "AT STATION" },
            { station: "Vijayawada Jn (BZA)", code: "BZA", arrival: "21:10", departure: "21:20", day: 2, status: "SCHEDULED" },
            { station: "Katpadi Jn (KPD)", code: "KPD", arrival: "06:10", departure: "06:15", day: 3, status: "SCHEDULED" },
            { station: "Trivandrum Central (TVC)", code: "TVC", arrival: "18:00", departure: "--", day: 3, status: "SCHEDULED" }
        ]
    },
    {
        id: "tr-105",
        trainNumber: "12260",
        name: "Sealdah Duronto Express",
        source: "Bikaner Jn (BKN)",
        destination: "Sealdah (SDAH)",
        departureTime: "12:15",
        arrivalTime: "12:30 (+1 day)",
        status: "ON-TIME",
        speed: "110 km/h",
        currentStation: "Jaipur Jn (JP)",
        nextStation: "Kanpur Central (CNB)",
        delayMinutes: 0,
        type: "Duronto Express",
        totalCoaches: 20,
        occupancy: "89%",
        route: [
            { station: "Bikaner Jn (BKN)", code: "BKN", arrival: "--", departure: "12:15", day: 1, status: "DEPARTED" },
            { station: "Jaipur Jn (JP)", code: "JP", arrival: "17:30", departure: "17:40", day: 1, status: "DEPARTED" },
            { station: "Kanpur Central (CNB)", code: "CNB", arrival: "00:35", departure: "00:40", day: 2, status: "EN ROUTE" },
            { station: "Dhanbad Jn (DHN)", code: "DHN", arrival: "08:15", departure: "08:20", day: 2, status: "SCHEDULED" },
            { station: "Sealdah (SDAH)", code: "SDAH", arrival: "12:30", departure: "--", day: 2, status: "SCHEDULED" }
        ]
    },
    {
        id: "tr-106",
        trainNumber: "11019",
        name: "Konark Express",
        source: "Chhatrapati Shivaji Maharaj T (CSMT)",
        destination: "Bhubaneswar (BBS)",
        departureTime: "14:00",
        arrivalTime: "23:20 (+1 day)",
        status: "SCHEDULED",
        speed: "0 km/h",
        currentStation: "CSMT Terminal",
        nextStation: "Kalyan Jn (KYN)",
        delayMinutes: 0,
        type: "Express",
        totalCoaches: 22,
        occupancy: "78%",
        route: [
            { station: "Mumbai CSMT (CSMT)", code: "CSMT", arrival: "--", departure: "14:00", day: 1, status: "SCHEDULED" },
            { station: "Kalyan Jn (KYN)", code: "KYN", arrival: "14:55", departure: "14:58", day: 1, status: "SCHEDULED" },
            { station: "Pune Jn (PUNE)", code: "PUNE", arrival: "17:55", departure: "18:00", day: 1, status: "SCHEDULED" },
            { station: "Secunderabad (SC)", code: "SC", arrival: "07:35", departure: "07:55", day: 2, status: "SCHEDULED" },
            { station: "Bhubaneswar (BBS)", code: "BBS", arrival: "23:20", departure: "--", day: 2, status: "SCHEDULED" }
        ]
    }
];

// Get all trains
export const getAllTrains = async () => {
    try {
        const response = await api.get("/trains");
        return { data: response.data || MOCK_TRAINS };
    } catch (error) {
        console.warn("Using mock train data fallback.", error.message);
        return { data: MOCK_TRAINS };
    }
};

// Get details by train ID or train number
export const getTrainById = async (id) => {
    try {
        const response = await api.get(`/trains/${id}`);
        return { data: response.data };
    } catch (error) {
        console.warn("Using mock train detail fallback for ID:", id, error.message);
        const train = MOCK_TRAINS.find(t => t.id === id || t.trainNumber === id) || MOCK_TRAINS[0];
        return { data: train };
    }
};

// Create a new Train (Admin capability)
export const createTrain = async (trainData) => {
    try {
        const response = await api.post("/trains", trainData);
        return { data: response.data };
    } catch (error) {
        console.warn("Using mock createTrain fallback.", error.message);
        const newTrain = {
            id: `tr-${Date.now()}`,
            ...trainData,
            status: trainData.status || "SCHEDULED",
            speed: trainData.speed || "0 km/h",
            delayMinutes: 0,
            route: trainData.route || [
                { station: trainData.source || "Origin", code: "ORG", arrival: "--", departure: trainData.departureTime || "08:00", day: 1, status: "SCHEDULED" },
                { station: trainData.destination || "Destination", code: "DST", arrival: trainData.arrivalTime || "18:00", departure: "--", day: 1, status: "SCHEDULED" }
            ]
        };
        MOCK_TRAINS.unshift(newTrain);
        return { data: newTrain, message: "Train created successfully (Mock)" };
    }
};

// Update Train details
export const updateTrain = async (id, trainData) => {
    try {
        const response = await api.put(`/trains/${id}`, trainData);
        return { data: response.data };
    } catch (error) {
        console.warn("Using mock updateTrain fallback.", error.message);
        const idx = MOCK_TRAINS.findIndex(t => t.id === id);
        if (idx !== -1) {
            MOCK_TRAINS[idx] = { ...MOCK_TRAINS[idx], ...trainData };
            return { data: MOCK_TRAINS[idx] };
        }
        return { data: trainData };
    }
};

// Delete train
export const deleteTrain = async (id) => {
    try {
        const response = await api.delete(`/trains/${id}`);
        return { data: response.data };
    } catch (error) {
        console.warn("Using mock deleteTrain fallback.", error.message);
        const idx = MOCK_TRAINS.findIndex(t => t.id === id);
        if (idx !== -1) MOCK_TRAINS.splice(idx, 1);
        return { success: true };
    }
};
