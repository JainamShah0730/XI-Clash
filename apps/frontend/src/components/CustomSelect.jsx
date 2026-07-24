import { useState, useRef, useEffect } from "react";

export default function CustomSelect({ value, options, onChange, renderOption }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value) || options[0];

    return (
        <div ref={containerRef} style={{ position: "relative", width: "100%", fontFamily: "var(--font-body)" }}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    padding: "0.6rem 0.8rem", 
                    background: "rgba(0, 0, 0, 0.2)", 
                    border: `1px solid ${isOpen ? "var(--gold)" : "rgba(255, 255, 255, 0.1)"}`,
                    borderRadius: "8px", 
                    cursor: "pointer", 
                    color: "var(--text)",
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    transition: "all 0.2s ease"
                }}
            >
                <span>{selectedOption ? (renderOption ? renderOption(selectedOption) : selectedOption.label) : "Select..."}</span>
                <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", fontSize: "0.6rem", color: "var(--text-dim)" }}>▼</span>
            </div>

            {isOpen && (
                <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: "4px",
                    background: "rgba(18, 27, 46, 0.98)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.6)",
                    zIndex: 100,
                    maxHeight: "300px",
                    overflowY: "auto",
                    padding: "0.3rem"
                }}>
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                            style={{
                                padding: "0.6rem 0.8rem",
                                cursor: "pointer",
                                borderRadius: "6px",
                                color: opt.value === value ? "var(--gold)" : "var(--text)",
                                background: opt.value === value ? "rgba(232, 179, 61, 0.15)" : "transparent",
                                transition: "all 0.15s ease",
                                display: "flex",
                                alignItems: "center"
                            }}
                            onMouseEnter={(e) => {
                                if (opt.value !== value) e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                            }}
                            onMouseLeave={(e) => {
                                if (opt.value !== value) e.currentTarget.style.background = "transparent";
                            }}
                        >
                            {renderOption ? renderOption(opt) : opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
