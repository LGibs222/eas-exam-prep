import { useEffect, useRef, useState } from 'react'

/**
 * One Love TTS — calls the authenticated Vercel tutor backend, which fronts
 * ElevenLabs server-side (replaced the old unauthenticated Cloudflare Worker;
 * the backend validates the access code, checks the text is this app's own
 * content, and enforces the budget).
 */
const TTS_ENDPOINT = 'https://onelove-tutor-backend.vercel.app/api/tts'
const TTS_APP = 'EAS'

const isConfigured = () => !!TTS_ENDPOINT && !TTS_ENDPOINT.startsWith('PASTE_')

// Single shared audio element so a new play() always interrupts the prior one.
let sharedAudio = null
function getAudio() {
  if (sharedAudio) return sharedAudio
  sharedAudio = new Audio()
  return sharedAudio
}

// Module-level subscription so multiple buttons can show "loading" / "playing"
// state for whichever one started the current playback.
const listeners = new Set()
let currentToken = null   // identifies which button owns the current audio
let currentState = 'idle' // 'idle' | 'loading' | 'playing'
function setCurrent(token, state) {
  currentToken = token
  currentState = state
  listeners.forEach(fn => fn())
}

export function useTTSState(token) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const fn = () => setTick(t => t + 1)
    listeners.add(fn)
    return () => listeners.delete(fn)
  }, [])
  if (currentToken !== token) return 'idle'
  return currentState
}

// Resolver for the playback in flight, so callers can await the end of a clip
// (the lesson player reads a screen block by block and highlights each one).
let pendingDone = null
function settle(finished) { const fn = pendingDone; pendingDone = null; if (fn) fn(finished) }

export function stopTTS() {
  const a = getAudio()
  try { a.pause(); a.currentTime = 0 } catch {}
  setCurrent(null, 'idle')
  settle(false)
}

let ttsRate = 1
export function setTTSRate(r) { ttsRate = r; try { getAudio().playbackRate = r } catch {} }

// Same as playTTS, but resolves true when the clip plays to the end and false
// when it is stopped, replaced, or refused.
export function playTTSAsync(text, token) {
  return new Promise(resolve => {
    playTTS(text, token, resolve)
  })
}

// text: a string, or an array of the app's own strings read in order (the backend
// checks each piece against the app's published content).
export async function playTTS(text, token, onDone) {
  if (!isConfigured() || !(Array.isArray(text) ? text.join('') : text)) { onDone?.(false); return }
  const audio = getAudio()
  // If this same token is currently playing, treat as toggle-stop.
  if (currentToken === token && currentState === 'playing') {
    stopTTS()
    onDone?.(false)
    return
  }
  try { audio.pause(); audio.currentTime = 0 } catch {}
  settle(false)
  pendingDone = onDone || null
  setCurrent(token, 'loading')
  try {
    let code = '', name = ''
    try { code = localStorage.getItem('ol-code') || ''; name = localStorage.getItem('ol-user') || '' } catch {}
    const parts = Array.isArray(text) ? text : [text]
    const res = await fetch(TTS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parts, text: parts.join('').slice(0, 1500), app: TTS_APP, code, name }),
    })
    if (!res.ok) throw new Error(`tts_${res.status}`)
    // Budget/auth refusals come back as JSON instead of audio.
    if ((res.headers.get('content-type') || '').includes('application/json')) throw new Error('tts_denied')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    audio.src = url
    if (pendingDone !== (onDone || null)) { URL.revokeObjectURL(url); return } // superseded while loading
    audio.onended = () => { URL.revokeObjectURL(url); setCurrent(null, 'idle'); settle(true) }
    audio.onerror = () => { URL.revokeObjectURL(url); setCurrent(null, 'idle'); settle(false) }
    audio.playbackRate = ttsRate
    await audio.play()
    audio.playbackRate = ttsRate
    setCurrent(token, 'playing')
  } catch (err) {
    console.warn('[TTS] playback failed', err)
    setCurrent(null, 'idle')
    settle(false)
  }
}

/**
 * 🔊 button — pass `text` to read aloud and `token` (any unique string for
 * this button instance, e.g. `module:${id}` or `rationale:${qIdx}`).
 *
 * Renders disabled with a tooltip if TTS_ENDPOINT is unset.
 */
function SpeakerGlyph({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: '-2px' }} aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4zM15.5 9a4.2 4.2 0 0 1 0 6M18.2 7a7.4 7.4 0 0 1 0 10"/>
    </svg>
  )
}

export function TTSButton({ text, token, label = 'Read aloud', size = 'sm', style = {} }) {
  const state = useTTSState(token)
  const configured = isConfigured()
  const disabled = !configured || !(Array.isArray(text) ? text.join('') : text)
  const isPlaying = state === 'playing'
  const isLoading = state === 'loading'

  const sizes = {
    xs: { padding: '4px 8px', fontSize: 11 },
    sm: { padding: '6px 12px', fontSize: 12 },
    md: { padding: '8px 14px', fontSize: 13 },
  }

  return (
    <button
      type="button"
      onClick={() => !disabled && playTTS(text, token)}
      disabled={disabled}
      title={!configured ? 'Voice playback not yet set up' : isPlaying ? 'Tap to stop' : 'Read aloud'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: isPlaying ? 'var(--berry, #1e4d2b)' : 'transparent',
        color: isPlaying ? '#fff' : (disabled ? 'var(--muted, #999)' : 'var(--berry, #1e4d2b)'),
        opacity: disabled ? 0.55 : 1,
        border: `1px solid ${disabled ? 'var(--border, rgba(0,0,0,0.12))' : 'var(--berry, #1e4d2b)'}`,
        borderRadius: 99, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', whiteSpace: 'nowrap',
        ...sizes[size],
        ...style,
      }}
    >
      <span aria-hidden style={{ display: 'inline-flex', alignItems: 'center' }}>{isLoading ? '…' : isPlaying ? '■' : <SpeakerGlyph/>}</span>
      {label && <span>{isLoading ? 'Loading…' : isPlaying ? 'Stop' : label.replace('🔊 ', '')}</span>}
    </button>
  )
}
