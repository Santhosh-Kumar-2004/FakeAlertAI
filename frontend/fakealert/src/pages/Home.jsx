import React, { useState, useEffect } from 'react'
import ResultCard from '../components/ResultCard'
import { languages } from '../utils/languages'

const Home = () => {
  const [text, setText] = useState("")
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [typingTimeout, setTypingTimeout] = useState(null)
  const [recentScans, setRecentScans] = useState([])
  const [scanTime, setScanTime] = useState(null)

  const handleSubmit = async (overrideText = null) => {
    const inputText = overrideText !== null ? overrideText : text

    if (!inputText.trim()) {
      setError("Please enter some text.")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)
    const start = performance.now()

    try {
      const response = await fetch("http://localhost:8000/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: inputText, lang })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || "Something went wrong.")
      }

      const data = await response.json()
      setResult(data)

      // Save to history (5 max)
      const newHistory = [data, ...recentScans.slice(0, 4)]
      setRecentScans(newHistory)
      localStorage.setItem("recentScans", JSON.stringify(newHistory))

      // Record scan time
      const end = performance.now()
      setScanTime(((end - start) / 1000).toFixed(2))
    } catch (err) {
      setError(err.message || "Error contacting backend.")
    } finally {
      setLoading(false)
    }
  }

  const handleTextChange = (e) => {
    const value = e.target.value
    setText(value)

    if (typingTimeout) clearTimeout(typingTimeout)
    setTypingTimeout(setTimeout(() => {
      handleSubmit(value)
    }, 1500))
  }

  const toggleTheme = () => {
    document.body.classList.toggle("light")
  }

  useEffect(() => {
    // Load history on start
    const stored = localStorage.getItem("recentScans")
    if (stored) {
      setRecentScans(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
  if (text.trim() && result) {
    handleSubmit();
  }
}, [lang]);


  useEffect(() => {
    localStorage.setItem("lang", lang)
  }, [lang])

  return (
    <div className="container">
      <h1>🛡️ FakeAlert: Scam Analyzer</h1>
      <p>Enter a message to check if it's a scam or fake news.</p>

      <textarea
        placeholder="Paste the suspicious message here..."
        value={text}
        onChange={handleTextChange}
      ></textarea>

      <div className="controls">
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        <button className="toggle-theme" onClick={toggleTheme}>
          Toggle Theme
        </button>
      </div>

      {scanTime && <p>🕒 Scanned in {scanTime} seconds</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ResultCard result={result} />

      {/* {recentScans.length > 0 && (
        <div className="recent-scans">
          <h3>🕘 Recent Scans</h3>
          {recentScans.map((scan, index) => (
            <div key={index} className="result-card mini">
              <p><strong>Verdict:</strong> {scan.verdict}</p>
              <p><strong>Risk:</strong> {scan.risk_score}</p>
              <p><strong>Type:</strong> {scan.scam_type}</p>
            </div>
          ))}
        </div>
      )} */}
    </div>
  )
}

export default Home
