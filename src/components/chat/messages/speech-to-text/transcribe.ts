
async function transcribeAudio(audioBlob: Blob, sttGroqApiKey: string): Promise<string> {
  const API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions'

  const formData = new FormData()
  formData.append('file', audioBlob, 'audio.wav')
  formData.append('model', 'whisper-large-v3')
  formData.append('temperature', '0')
  formData.append('response_format', 'json')
  formData.append('language', 'en')


  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sttGroqApiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.text

  } catch (error) {
    console.error('Error transcribing audio:', error)
    throw new Error('Failed to transcribe audio')
  }
}

export default transcribeAudio