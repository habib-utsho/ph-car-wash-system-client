import { API_BASE_URL } from "../api/config";




export async function createBooking(payload: { serviceId: string, userEmail: string }) {
    console.log(payload, 'payload');
    try {
        const res = await fetch(`${API_BASE_URL}/bookings/create-checkout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            cache: "no-store",
        })
        console.log(res, 'res');
        if(!res.ok) {
            const error = await res.json().catch(() => null);
            throw new Error(error?.message || "Failed to create booking");
        }
        const data = await res.json();
        return data;
    } catch (err: any) {
        console.error("createBooking failed:", err);
        throw err;
    }
}