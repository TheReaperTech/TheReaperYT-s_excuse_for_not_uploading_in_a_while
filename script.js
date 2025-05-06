const API_KEY = "AIzaSyBMCaKjk7aGUIOpcVx1r6NXyKF5uJ7Kff8";
const CHANNEL_ID = "UCepeZdo5Q58283QID_PxIkQ";
const MAX_RESULTS = 30;

async function fetchVideos() {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        data.items
            .filter(item => item.id.videoId)
            .forEach(item => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;

                const iframe = document.createElement("iframe");
                iframe.src = `https://www.youtube.com/embed/${videoId}`;
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                iframe.width = "100%";
                iframe.height = "315";

                const titleElement = document.createElement("p");
                titleElement.textContent = title;

                const wrapper = document.createElement("div");
                wrapper.classList.add("video");
                wrapper.appendChild(titleElement);
                wrapper.appendChild(iframe);

                if (window.location.pathname.endsWith("videos.html")) {
                    document.querySelector(".video-container").appendChild(wrapper);
                } else if (window.location.pathname.endsWith("shorts.html")) {
                    // Only include shorts (filter by title or any custom tag)
                    if (title.toLowerCase().includes("shorts") || title.toLowerCase().includes("short")) {
                        document.querySelector(".shorts-container").appendChild(wrapper);
                    }
                } else {
                    // Main (index.html) - featured section
                    const featuredCopy = wrapper.cloneNode(true);
                    document.querySelector(".featured-container").appendChild(featuredCopy);
                }
            });

    } catch (error) {
        console.error("Error fetching videos:", error);
    }
}

// Search bar
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const filter = this.value.toLowerCase();
        const allVideos = document.querySelectorAll(".video-container .video");

        allVideos.forEach(video => {
            const title = video.querySelector("p").textContent.toLowerCase();
            video.style.display = title.includes(filter) ? "block" : "none";
        });
    });
}

// Comments
const commentForm = document.getElementById("comment-form");
if (commentForm) {
    commentForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const comment = document.getElementById("comment").value;
        const commentsList = document.getElementById("comments-list");

        if (name && comment) {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");
            commentDiv.innerHTML = `<strong>${name}:</strong> ${comment}`;
            commentsList.prepend(commentDiv);

            document.getElementById("name").value = "";
            document.getElementById("comment").value = "";
        }
    });
}

// Featured slider
const slideLeft = document.getElementById("slideLeft");
const slideRight = document.getElementById("slideRight");

if (slideLeft && slideRight) {
    slideLeft.addEventListener("click", () => {
        document.querySelector(".featured-container").scrollBy({ left: -300, behavior: 'smooth' });
    });

    slideRight.addEventListener("click", () => {
        document.querySelector(".featured-container").scrollBy({ left: 300, behavior: 'smooth' });
    });
}

// Init
document.addEventListener("DOMContentLoaded", fetchVideos);
