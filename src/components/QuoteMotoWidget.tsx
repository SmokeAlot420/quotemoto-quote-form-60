
import React from "react";
import { createRoot } from "react-dom/client";

function QuoteMotoWidget() {
    return (
        <div style={{
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
        }}>
            <h2>🚗 Get Your Auto Insurance Quote! 🚗</h2>
            <button style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
            }}>
                Get a Quote
            </button>
        </div>
    );
}

// Only run this code if we're in a browser environment
if (typeof window !== 'undefined') {
    window.onload = function () {
        const container = document.getElementById("quotemoto-widget");
        if (container) {
            const root = createRoot(container);
            root.render(<React.StrictMode><QuoteMotoWidget /></React.StrictMode>);
        }
    };
}

export default QuoteMotoWidget;
