"""
AI Visual Design Critic Microservice Bridge
Framework: Python 3.15 + Standard Library HTTP Server / FastMCP Compatible
Adheres to PRD Section 3 & 4 (ACGT Framework: Analyze, Clarify, Guide, Track)
"""

import json
import math
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from typing import Dict, Any, List, Tuple


def get_relative_luminance(hex_color: str) -> float:
    """WCAG 2.1 Relative Luminance formula L = 0.2126*R + 0.7152*G + 0.0722*B"""
    clean_hex = hex_color.lstrip('#')
    if len(clean_hex) != 6:
        return 0.5
    
    r = int(clean_hex[0:2], 16) / 255.0
    g = int(clean_hex[2:4], 16) / 255.0
    b = int(clean_hex[4:6], 16) / 255.0

    def gamma(v: float) -> float:
        return v / 12.92 if v <= 0.03928 else math.pow((v + 0.055) / 1.055, 2.4)

    return 0.2126 * gamma(r) + 0.7152 * gamma(g) + 0.0722 * gamma(b)


def get_contrast_ratio(hex1: str, hex2: str) -> float:
    """Calculate WCAG 2.1 contrast ratio: (L1 + 0.05) / (L2 + 0.05)"""
    l1 = get_relative_luminance(hex1)
    l2 = get_relative_luminance(hex2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return round((lighter + 0.05) / (darker + 0.05), 2)


def evaluate_design_acgt(assets: Dict[str, Any], format_type: str = "poster_1_1") -> Dict[str, Any]:
    """
    ACGT Evaluation Core:
    1. Analyze: Compute WCAG luminance, spatial margins, density
    2. Clarify: Diagnose aesthetic and usability issues
    3. Guide: Generate structured auto_fix property recommendations
    4. Track: Return score and metrics for version logging
    """
    issues: List[Dict[str, Any]] = []

    bg_color = assets.get("bgColor", "#070B14")
    headline_color = assets.get("headlineColor", "#FFFFFF")
    headline_size = assets.get("headlineFontSize", 42)
    subtitle_size = assets.get("subtitleFontSize", 16)
    subtitle_color = assets.get("subtitleColor", "#94A3B8")
    footer_height_pct = assets.get("footerHeightPercent", 12)

    # 1. Color Contrast (WCAG 2.1 AA)
    headline_ratio = get_contrast_ratio(headline_color, bg_color)
    min_contrast = 3.0 if headline_size >= 24 else 4.5

    if headline_ratio < min_contrast:
        issues.append({
            "issue_id": "ERR_CONTRAST_HEADLINE",
            "category": "color_contrast",
            "severity": "high" if headline_ratio < 2.5 else "medium",
            "target_layer": "headline",
            "bounding_box": [70, 200, 560, headline_size * 2],
            "description": f"Rasio kontras teks judul ({headline_ratio}:1) di bawah standar WCAG AA ({min_contrast}:1).",
            "auto_fix": {
                "property": "headlineColor",
                "value": "#FFFFFF" if get_relative_luminance(bg_color) < 0.5 else "#0F172A",
                "description": "Perbaiki warna teks judul menjadi kontras tajam sesuai WCAG 2.1."
            }
        })

    # 2. Typography Hierarchy (Title : Subtitle ratio >= 1.8x)
    ratio = headline_size / max(1, subtitle_size)
    if ratio < 1.6:
        issues.append({
            "issue_id": "ERR_HIERARCHY_RATIO",
            "category": "hierarchy",
            "severity": "high",
            "target_layer": "headline",
            "bounding_box": [70, 200, 560, headline_size * 2],
            "description": f"Hierarki tipografi lemah ({ratio:.1f}x). Headline kurang dominan dibandingkan subjudul.",
            "auto_fix": {
                "property": "headlineFontSize",
                "value": round(subtitle_size * 2.2),
                "description": f"Tingkatkan ukuran font judul menjadi {round(subtitle_size * 2.2)}px."
            }
        })

    # 3. Spatial & Safe Zone
    if format_type == "reels_9_16" and footer_height_pct > 18:
        issues.append({
            "issue_id": "ERR_SAFEZONE_REELS_FOOTER",
            "category": "safe_zone_violation",
            "severity": "high",
            "target_layer": "footer",
            "bounding_box": [0, 800, 540, 160],
            "description": "Footer menutupi area aman teks deskripsi & sound bar Instagram Reels.",
            "auto_fix": {
                "property": "footerHeightPercent",
                "value": 14,
                "description": "Koreksi tinggi footer menjadi 14%."
            }
        })

    # Scores
    score = 100
    for iss in issues:
        score -= 20 if iss["severity"] == "high" else 10
    score = max(20, min(100, score))

    return {
        "overall_score": score,
        "mode": "deterministic_fallback",
        "engine": "Python ACGT Visual Critic v1.0",
        "contrast_ratio": headline_ratio,
        "typography_ratio": round(ratio, 2),
        "issues": issues,
    }


class CriticHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_len = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_len)
        try:
            req_data = json.loads(post_body.decode('utf-8'))
            assets = req_data.get("assets", {})
            format_type = req_data.get("format", "poster_1_1")
            result = evaluate_design_acgt(assets, format_type)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result, indent=2).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


def run_service(port: int = 8000):
    server = HTTPServer(('127.0.0.1', port), CriticHandler)
    print(f"[Python AI Bridge] Microservice active on http://127.0.0.1:{port}")
    server.serve_forever()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run_service(port)
