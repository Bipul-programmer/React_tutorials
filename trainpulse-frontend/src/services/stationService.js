import api from "./api";

const MOCK_STATIONS = [
    {
        id: "st-001",
        code: "NDLS",
        name: "New Delhi Railway Station",
        city: "New Delhi",
        zone: "Northern Railway (NR)",
        platforms: 16,
        category: "NSG-1 (High Density)",
        status: "OPERATIONAL",
        dailyPassengerCount: "500,000+",
        contactNumber: "+91 11 2334 0000",
        amenities: ["Executive Lounge", "Escalators", "WiFi 6", "AC Waiting Rooms", "Food Court", "Retiring Rooms"],
        upcomingArrivals: [
            { trainNumber: "12301", trainName: "Howrah Rajdhani", time: "10:05", platform: "Platform 1", status: "On-Time" },
            { trainNumber: "12002", trainName: "Bhopal Shatabdi", time: "14:40", platform: "Platform 3", status: "Delayed 25 min" },
            { trainNumber: "12626", trainName: "Kerala Express", time: "18:00 (+2)", platform: "Platform 8", status: "On-Time" }
        ],
        upcomingDepartures: [
            { trainNumber: "12002", trainName: "Bhopal Shatabdi", time: "06:00", platform: "Platform 1", status: "Departed" },
            { trainNumber: "12626", trainName: "Kerala Express", time: "20:10", platform: "Platform 4", status: "On-Time" }
        ]
    },
    {
        id: "st-002",
        code: "HWH",
        name: "Howrah Junction",
        city: "Kolkata",
        zone: "Eastern Railway (ER)",
        platforms: 23,
        category: "NSG-1 (Heritage Hub)",
        status: "OPERATIONAL",
        dailyPassengerCount: "1,000,000+",
        contactNumber: "+91 33 2660 2222",
        amenities: ["Yatri Niwas", "Taxi Stand", "WiFi", "Subway Access", "Cloak Room", "Medical Kiosk"],
        upcomingArrivals: [
            { trainNumber: "12260", trainName: "Duronto Express", time: "12:30", platform: "Platform 9", status: "On-Time" }
        ],
        upcomingDepartures: [
            { trainNumber: "12301", trainName: "Howrah Rajdhani", time: "16:50", platform: "Platform 8", status: "Departed" }
        ]
    },
    {
        id: "st-003",
        code: "CSMT",
        name: "Chhatrapati Shivaji Maharaj Terminus",
        city: "Mumbai",
        zone: "Central Railway (CR)",
        platforms: 18,
        category: "NSG-1 (World Heritage)",
        status: "OPERATIONAL",
        dailyPassengerCount: "600,000+",
        contactNumber: "+91 22 2262 0111",
        amenities: ["Heritage Museum", "Suburban Concourse", "VIP Lounge", "Multi-level Parking"],
        upcomingArrivals: [
            { trainNumber: "20901", trainName: "Vande Bharat Express", time: "12:25", platform: "Platform 18", status: "On-Time" }
        ],
        upcomingDepartures: [
            { trainNumber: "11019", trainName: "Konark Express", time: "14:00", platform: "Platform 15", status: "Boarding" }
        ]
    },
    {
        id: "st-004",
        code: "CNB",
        name: "Kanpur Central",
        city: "Kanpur",
        zone: "North Central Railway (NCR)",
        platforms: 10,
        category: "NSG-2 (Junction Hub)",
        status: "OPERATIONAL",
        dailyPassengerCount: "350,000+",
        contactNumber: "+91 512 230 4000",
        amenities: ["Electric Vehicle Charging", "Resting Pods", "Food Plaza", "24x7 Help Desk"],
        upcomingArrivals: [
            { trainNumber: "12301", trainName: "Howrah Rajdhani", time: "04:30", platform: "Platform 2", status: "At Platform" }
        ],
        upcomingDepartures: [
            { trainNumber: "12301", trainName: "Howrah Rajdhani", time: "04:35", platform: "Platform 2", status: "Boarding" }
        ]
    },
    {
        id: "st-005",
        code: "SBC",
        name: "KSR Bengaluru City Junction",
        city: "Bengaluru",
        zone: "South Western Railway (SWR)",
        platforms: 10,
        category: "NSG-1 (IT Corridor)",
        status: "OPERATIONAL",
        dailyPassengerCount: "250,000+",
        contactNumber: "+91 80 2287 3333",
        amenities: ["Metro Connectivity", "Airport Bus Shuttle", "Battery Buggy", "Free High-Speed WiFi"],
        upcomingArrivals: [],
        upcomingDepartures: []
    }
];

export const getAllStations = async () => {
    try {
        const response = await api.get("/stations");
        return { data: response.data || MOCK_STATIONS };
    } catch (error) {
        console.warn("Using mock station list fallback.");
        return { data: MOCK_STATIONS };
    }
};

export const getStationById = async (id) => {
    try {
        const response = await api.get(`/stations/${id}`);
        return { data: response.data };
    } catch (error) {
        const station = MOCK_STATIONS.find(s => s.id === id || s.code === id) || MOCK_STATIONS[0];
        return { data: station };
    }
};
