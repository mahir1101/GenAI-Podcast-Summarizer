const resultDiv = document.getElementById("result");
const bottomActionBtn = document.getElementById("bottomActionBtn");

document.getElementById("summarizeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = document.getElementById("url").value;

    resultDiv.innerHTML = `<div class="loading text-center">⏳Transcribing and summarizing... please wait.</div>`;

    try {
        const response = await fetch("/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<div class="alert alert-danger"> ${data.error} </div>`;
            bottomActionBtn.innerHTML = `<a href="/" class="btn btn-outline-light">Home</a>`;
        } else {
            resultDiv.innerHTML = `
                <h5 class="mt-4">
                    Transcript
                    <button onclick="toggleFullscreen('transcriptBlock')" class="btn btn-sm fullscreen-btn">⤊</button>
                </h5>
                <pre id="transcriptBlock">${data.transcript}</pre>

                <h5 class="mt-4">
                    Summary
                    <button onclick="toggleFullscreen('summaryBlock')" class="btn btn-sm fullscreen-btn">⤊</button>
                </h5>
                <pre id="summaryBlock">${data.summary}</pre>
            `;
            bottomActionBtn.innerHTML = `<a href="/" class="btn btn-outline-light">Home</a>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Unexpected error: ${error.message}</div>`;
        bottomActionBtn.innerHTML = `<a href="/" class="btn btn-outline-light">Home</a>`;
    }
});

function toggleFullscreen(elementId) {
    const elem = document.getElementById(elementId);
    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}