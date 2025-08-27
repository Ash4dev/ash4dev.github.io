async function loadSongs() {
    try {
        // Create base container if not present
        if (!document.getElementById("song-list")) {
            const container = document.createElement("ul");
            container.id = "song-list";
            container.className = "song-list";
            document.body.appendChild(container);
        }

        const response = await fetch("../src/media/yt_clean.json");
        const songs = await response.json();

        const listContainer = document.getElementById("song-list");

        songs.forEach((song, index) => {
            // <li class="song-item">
            const li = document.createElement("li");
            li.className = "song-item";

            // Left part: number + title
            const leftDiv = document.createElement("div");
            leftDiv.className = "song-item-left";

            const numberSpan = document.createElement("span");
            numberSpan.className = "song-number";
            numberSpan.textContent = index + 1;

            const infoDiv = document.createElement("div");
            infoDiv.className = "song-info";

            const titleSpan = document.createElement("span");
            titleSpan.className = "song-title";
            titleSpan.textContent = song.title;

            infoDiv.appendChild(titleSpan);
            leftDiv.appendChild(numberSpan);
            leftDiv.appendChild(infoDiv);

            // Right part: icon link
            const rightDiv = document.createElement("div");
            rightDiv.className = "song-item-right";

            const link = document.createElement("a");
            link.className = "song-link";
            link.href = song.url;
            link.target = "_blank"; // open in new tab

            const img = document.createElement("img");
            img.src = "./../src/media/Youtube_Music_icon.png";
            img.alt = "Play on YouTube Music";
            img.className = "song-thumbnail";

            link.appendChild(img);
            rightDiv.appendChild(link);

            // Assemble row
            li.appendChild(leftDiv);
            li.appendChild(rightDiv);

            listContainer.appendChild(li);
        });

        // Add scrollable list class if more than 10 songs
        if (songs.length > 10) {
            listContainer.classList.add("scrollable-list");
        }
    } catch (error) {
        console.error("Error loading songs:", error);
    }
}

// Add stylesheet if page is empty
function injectStylesheet() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./music-styles.css"; // adjust path if needed
    document.head.appendChild(link);
}

// Run on load
document.addEventListener("DOMContentLoaded", () => {
    injectStylesheet();
    loadSongs();
});
