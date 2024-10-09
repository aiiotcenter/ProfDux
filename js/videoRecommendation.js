async function getRelevantVideoFromGPT(videoOptions, courseName, lectureTitle, openAiApiKey) {
    const messages = [
        {
            role: "system",
            content: "You are an AI that helps select the most relevant educational video for a given course. Your goal is to choose the video that is most closely related to the course and lecture topic."
        },
        {
            role: "user",
            content: `The course name is "${courseName}" and the lecture title is "${lectureTitle}". Here are the available video options:\n\n` +
                videoOptions.map((video, index) => 
                    `Option ${index + 1}: Title: "${video.title}", Description: "${video.description}", Channel: "${video.channelTitle}", Published Date: "${video.publishedAt}"`).join('\n\n') +
                "\n\nPlease choose the option that best matches the course name and lecture title. Explain why you selected that option, and provide the corresponding option number."
        }
    ];

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openAiApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: messages,
                max_tokens: 150,
                temperature: 0.5
            })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("Failed to get a response from GPT:", errorResponse);
            throw new Error("Failed to get a response from GPT");
        }

        const gptData = await response.json();
        const gptText = gptData.choices[0].message.content.trim();

        // Extract the selected option number from the GPT response
        const selectedOptionMatch = gptText.match(/Option\s+(\d+)/i);
        if (selectedOptionMatch) {
            const selectedIndex = parseInt(selectedOptionMatch[1], 10) - 1;
            return videoOptions[selectedIndex];
        }

        console.warn("GPT response did not contain a valid option number:", gptText);
        return null;
    } catch (error) {
        console.error("Error while communicating with GPT:", error);
        return null;
    }
}

// Fallback function to choose the best match if GPT fails
function chooseBestVideoFallback(videoOptions, courseName, lectureTitle) {
    const keywords = [
        courseName.toLowerCase(),
        lectureTitle.toLowerCase(),
        "lecture"
    ];

    // Score videos based on keyword matches in title and description
    return videoOptions.reduce((bestMatch, video) => {
        let score = 0;
        for (const keyword of keywords) {
            if (video.title.toLowerCase().includes(keyword)) score += 2;
            if (video.description.toLowerCase().includes(keyword)) score += 1;
        }
        return score > bestMatch.score ? { video, score } : bestMatch;
    }, { video: null, score: 0 }).video;
}

async function recommendVideo({ courseName, lectureTitle }) {
    try {
        // Fetch the OpenAI API key securely
        const response = await fetchOpenAIKey();
        const openAiApiKey = response[0].value;

        const apiKey = 'AIzaSyAHP47F5RTqzx3Xf95Zh1sOLdUD1bDzAuE'; 
        const endpoint = 'https://www.googleapis.com/youtube/v3/search';

        // Construct the search query with the course and lecture title
        const query = `"${courseName}" "${lectureTitle}" lecture`;

        // Build the API request URL
        const url = `${endpoint}?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}&maxResults=5&order=relevance&videoEmbeddable=true&videoSyndicated=true&relevanceLanguage=en`;

        const responseYoutube = await fetch(url);

        if (!responseYoutube.ok) {
            const errorResponse = await responseYoutube.json();
            throw new Error(`Failed to get video recommendation: ${errorResponse.error.message}`);
        }

        const data = await responseYoutube.json();

        if (data.items.length === 0) {
            throw new Error('No videos found for the given topic.');
        }

        const videoOptions = data.items.map(item => ({
            title: item.snippet.title,
            description: item.snippet.description,
            videoId: item.id.videoId,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt
        }));

        // Use GPT-4 to analyze and find the most relevant video
        const gptSelectedVideo = await getRelevantVideoFromGPT(videoOptions, courseName, lectureTitle, openAiApiKey);

        if (gptSelectedVideo) {
            const videoUrl = `https://www.youtube.com/watch?v=${gptSelectedVideo.videoId}`;
            return {
                videoUrl,
                videoTitle: gptSelectedVideo.title,
                videoDescription: gptSelectedVideo.description,
                channelTitle: gptSelectedVideo.channelTitle,
                publishedAt: gptSelectedVideo.publishedAt,
            };
        } else {
            // Fallback to keyword matching if GPT fails
            const fallbackVideo = chooseBestVideoFallback(videoOptions, courseName, lectureTitle);

            if (fallbackVideo) {
                const videoUrl = `https://www.youtube.com/watch?v=${fallbackVideo.videoId}`;
                return {
                    videoUrl,
                    videoTitle: fallbackVideo.title,
                    videoDescription: fallbackVideo.description,
                    channelTitle: fallbackVideo.channelTitle,
                    publishedAt: fallbackVideo.publishedAt,
                };
            } else {
                throw new Error('No relevant lecture video found for the given topic.');
            }
        }
    } catch (error) {
        console.error("Error fetching video:", error);
        throw new Error(`Error fetching video: ${error.message}`);
    }
}
