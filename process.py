import os
import uuid
import yt_dlp
from faster_whisper import WhisperModel
import subprocess

AUDIO_FOLDER = "downloads"
os.makedirs(AUDIO_FOLDER, exist_ok=True)

def download_audio(url):
    base_name = uuid.uuid4().hex
    output_template = os.path.join(AUDIO_FOLDER, f"{base_name}.%(ext)s")
    mp3_path = os.path.join(AUDIO_FOLDER, f"{base_name}.mp3")

    ffmpeg_path = r"C:\ffmpeg-2025-04-14-git-3b2a9410ef-essentials_build\bin"

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_template,
        'quiet': True,
        'ffmpeg_location': ffmpeg_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    if not os.path.exists(mp3_path):
        raise FileNotFoundError("Audio file was not created.")

    return mp3_path

def transcribe_audio(filepath):
    model = WhisperModel("tiny", compute_type="float16", device="cuda")
    segments, info = model.transcribe(filepath)

    transcript = ""
    for segment in segments:
        transcript += segment.text + " "

    return transcript.strip()

def summarize_with_llama(text):
    prompt = f"Summarize the following podcast transcript:\n\n{text}"

    process = subprocess.Popen(
        ["ollama", "run", "llama2"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    output, error = process.communicate(input=prompt)

    if process.returncode != 0:
        raise RuntimeError(f"Ollama error: {error}")

    return output.strip()