import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function TestBookingPage() {
    const [token, setToken] = useState<string | null>(null);

    /* ---------------- LOGIN STATE ---------------- */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /* ---------------- BOOKING FORM ---------------- */
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");

    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("4W");
    const [serviceId, setServiceId] = useState("");
    const [addons, setAddons] = useState<string[]>([]);

    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("MORNING");

    const [services, setServices] = useState<any[]>([]);
    const [addonsList, setAddonsList] = useState<any[]>([]);

    const [availability, setAvailability] = useState<any>(null);
    const [result, setResult] = useState<any>(null);

    /* ---------------- LOGIN ---------------- */
    const handleLogin = async () => {
        try {
            const res = await axios.post(`${API}/auth/login`, {
                email,
                password,
            });

            const data = res.data.data;
            setToken(data.accessToken);

            setName(data.user.name);
            setMobile(data.user.mobile);
        } catch (err: any) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    /* ---------------- LOAD SERVICES ---------------- */
    useEffect(() => {
        if (!token) return;

        axios
            .get(`${API}/services/vehicleType/${vehicleType}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setServices(res.data.data));

        axios
            .get(`${API}/addons`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setAddonsList(res.data.data));
    }, [token, vehicleType]);

    /* ---------------- SLOT CHECK ---------------- */
    const checkSlot = async () => {
        if (!date || !slot) return;

        const res = await axios.get(
            `${API}/bookings/slot/${date}/${slot}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        setAvailability(res.data.data);
    };

    /* ---------------- CREATE BOOKING ---------------- */
    const createBooking = async () => {
        try {
            const res = await axios.post(
                `${API}/bookings`,
                {
                    customer: {
                        name,
                        mobile,
                        address,
                    },
                    vehicles: [
                        {
                            type: vehicleType,
                            number: vehicleNumber,
                            serviceId,
                            addons,
                        },
                    ],
                    slot,
                    date,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setResult(res.data.data);
        } catch (err: any) {
            alert(err.response?.data?.message || "Booking failed");
        }
    };

    /* ---------------- UI ---------------- */
    if (!token) {
        return (
            <div className="p-4 flex flex-col gap-3 max-w-md">
                <h2 className="text-lg font-semibold">Customer Login</h2>

                <input
                    placeholder="Email"
                    className="border p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    placeholder="Password"
                    type="password"
                    className="border p-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="bg-black text-white p-2"
                >
                    Login
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col gap-3 max-w-md">
            <h2 className="text-lg font-semibold">Test Booking</h2>

            {/* CUSTOMER */}
            <input
                placeholder="Name"
                className="border p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Mobile"
                className="border p-2"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
            />

            <input
                placeholder="Address"
                className="border p-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />

            {/* VEHICLE */}
            <input
                placeholder="Vehicle Number"
                className="border p-2"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
            />

            <select
                className="border p-2"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
            >
                <option value="2W">2W</option>
                <option value="4W">4W</option>
                <option value="CAB">CAB</option>
            </select>

            {/* SERVICE */}
            <select
                className="border p-2"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
            >
                <option value="">Select Service</option>
                {services.map((s) => (
                    <option key={s._id} value={s._id}>
                        {s.name} – ₹ {s.price}
                    </option>
                ))}
            </select>

            {/* ADDONS */}
            <div className="flex flex-col gap-1">
                <p className="text-sm">Add-ons</p>
                {addonsList.map((a) => (
                    <label key={a._id} className="text-sm">
                        <input
                            type="checkbox"
                            value={a._id}
                            onChange={(e) => {
                                if (e.target.checked)
                                    setAddons([...addons, a._id]);
                                else
                                    setAddons(addons.filter((id) => id !== a._id));
                            }}
                        />
                        {a.name} – ₹ {a.price}
                    </label>
                ))}
            </div>

            {/* DATE */}
            <input
                type="date"
                className="border p-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            {/* SLOT */}
            <select
                className="border p-2"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
            >
                <option value="MORNING">MORNING</option>
                <option value="AFTERNOON">AFTERNOON</option>
                <option value="EVENING">EVENING</option>
            </select>

            <button
                onClick={checkSlot}
                className="bg-gray-800 text-white p-2"
            >
                Check Slot
            </button>

            {availability && (
                <p className="text-sm">
                    Available: {availability.available} /{" "}
                    {availability.capacity}
                </p>
            )}

            {/* SUBMIT */}
            <button
                onClick={createBooking}
                className="bg-black text-white p-2"
            >
                Create Booking
            </button>

            {/* RESULT */}
            {result && (
                <div className="border p-2 mt-2">
                    <p>Booking ID: {result.bookingId}</p>
                    <p>Status: {result.status}</p>
                    <p>Total: ₹ {result.totalAmount}</p>
                </div>
            )}
        </div>
    );
}
