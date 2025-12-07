import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SiteSettings = () => {
    const [settings, setSettings] = useState({
        logo: "",
        footerText: "",
        bannerText: ""
    });
    const [loading, setLoading] = useState(false);

    // Load settings from server
    useEffect(() => {
        fetch("http://localhost:5000/settings")
            .then(res => res.json())
            .then(data => setSettings(data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        fetch("http://localhost:5000/settings", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(settings)
        })
            .then(res => res.json())
            .then(data => {
                if (data.modifiedCount > 0) {
                    Swal.fire("Success!", "Site settings updated", "success");
                } else {
                    Swal.fire("Info", "No changes made", "info");
                }
                setLoading(false);
            });
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow text-black">
            <h2 className="text-2xl font-semibold mb-6">⚙️ Site Settings</h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-black">

                {/* Logo URL */}
                <div>
                    <label className="font-medium">Logo URL</label>
                    <input
                        type="text"
                        name="logo"
                        value={settings.logo}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Enter logo URL"
                    />
                </div>

                {/* Banner Text */}
                <div>
                    <label className="font-medium">Banner Text</label>
                    <input
                        type="text"
                        name="bannerText"
                        value={settings.bannerText}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Enter homepage banner text"
                    />
                </div>

                {/* Footer Text */}
                <div>
                    <label className="font-medium">Footer Text</label>
                    <input
                        type="text"
                        name="footerText"
                        value={settings.footerText}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Enter footer text"
                    />
                </div>

                <button
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {loading ? "Saving..." : "Save Settings"}
                </button>
            </form>
        </div>
    );
};

export default SiteSettings;
