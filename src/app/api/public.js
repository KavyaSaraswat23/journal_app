import { unstable_cache } from "next/cache";
export const getDailyPrompts = unstable_cache(
    async () => {
        try {
            const res = await fetch("https://api.adviceslip.com/advice",
                { cache: "no-store" }
            )
            const data = await res.json();
            return data.slip.advice
        }
        catch (err) {
            return {
                success: false,
                data: "What's on your mind?"
            }
        }
    }, ["daily-prompt"],
    {
        revalidate: 86400,
        tags: ["daily-prompts"]
    },
)

export const getMoodImage = async (query) => {
    try {
        const response = await fetch(`https://pixabay.com/api?q=${query}&key=${process.env.PIXABAY_API_KEY}&min_width=1280&min_height=720&image_type=illustration&category=feelings`);
        const data = await response.json();
        console.log(data.hits[0]?.largeImageURL, "imageMood")
        return data.hits[0]?.largeImageURL;
    } catch (error) {
        return null;
    }
}