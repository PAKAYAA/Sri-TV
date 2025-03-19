const videoPlayer = document.getElementById("videoPlayer");
const channelList = document.getElementById("channel-list");
const m3uUrl = "https://iptv-org.github.io/iptv/languages/sin.m3u"; // Sinhala IPTV M3U link

async function loadChannels() {
    try {
        const response = await fetch(m3uUrl);
        const data = await response.text();
        const lines = data.split("\n");
        let currentChannel = null;

        lines.forEach((line) => {
            if (line.startsWith("#EXTINF")) {
                const channelName = line.split(",")[1];
                currentChannel = channelName;
            } else if (line.startsWith("http")) {
                const streamUrl = line.trim();
                createChannelButton(currentChannel, streamUrl);
            }
        });
    } catch (error) {
        console.error("Error loading M3U file:", error);
    }
}

function createChannelButton(name, url) {
    const button = document.createElement("button");
    button.textContent = name;
    button.onclick = () => playChannel(url);
    channelList.appendChild(button);
}

function playChannel(url) {
    // Use HLS.js for streaming if the browser supports it
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoPlayer);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            videoPlayer.play();
        });
    } else if (videoPlayer.canPlayType("application/vnd.apple.mpegurl")) {
        // For Safari (HLS support)
        videoPlayer.src = url;
        videoPlayer.play();
    } else {
        console.error("HLS is not supported in this browser");
    }
}

loadChannels();
